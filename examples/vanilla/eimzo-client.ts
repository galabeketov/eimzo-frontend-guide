/**
 * Frameworkdan mustaqil, minimal E-IMZO klienti.
 * Protokol tavsifi: docs/uz/03-protokol.md
 *
 * QORALAMA. Rasmiy e-imzo-client.js dan ko'chirilmagan, protokol bo'yicha
 * noldan yozilgan. Xato topsangiz PR yuboring.
 */

export type EimzoErrorKind = 'undastur' | 'rad';

export class EimzoError extends Error {
  constructor(public kind: EimzoErrorKind, message: string) {
    super(message);
    this.name = 'EimzoError';
  }
}

export interface EimzoKey {
  id: string;
  kind: 'pfx' | 'ftjc';
  /** E-IMZO kalitni ochish uchun kutadigan argumentlar */
  locator: string[];
  fullName: string;
  tin: string;
  pinfl: string;
  organisation: string;
  position: string;
  validUntil: Date | null;
}

export interface EimzoClientOptions {
  /** domen → kalit. localhost/127.0.0.1 kalitlari rasmiy qo'llanmada. */
  apiKeys: Record<string, string>;
  quickTimeoutMs?: number;    // default 20_000
  passwordTimeoutMs?: number; // default 300_000
}

const OID_TIN = '1.2.860.3.16.1.1';
const OID_PINFL = '1.2.860.3.16.1.2';
export const MINIMUM_VERSION = 336;

function socketUrl(): string {
  const origin = location.protocol === 'https:' ? 'wss://127.0.0.1:64443' : 'ws://127.0.0.1:64646';
  return `${origin}/service/cryptapi`;
}

function parseX500(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of s.split(/,(?=[A-Za-z0-9.]+=)/)) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim().toUpperCase()] = part.slice(i + 1).trim();
  }
  return out;
}

function parseDate(t?: string): Date | null {
  if (!t) return null;
  const d = new Date(t.replace(/\./g, '-').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function keyFromDescription(kind: 'pfx' | 'ftjc', locator: string[], description: string, index: number): EimzoKey | null {
  const f = parseX500(description);
  const pinfl = f[OID_PINFL] ?? '';
  const tin = f[OID_TIN] || f.UID || '';
  if (!pinfl && !tin) return null;
  return {
    id: `${kind}-${index}`, kind, locator,
    fullName: f.CN ?? '', tin, pinfl,
    organisation: f.O ?? '', position: f.T ?? '',
    validUntil: parseDate(f.VALIDTO),
  };
}

export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function createEimzoClient(options: EimzoClientOptions) {
  const quick = options.quickTimeoutMs ?? 20_000;
  const slow = options.passwordTimeoutMs ?? 300_000;

  type Reply<T> = T & { success?: boolean; reason?: string };

  function call<T>(request: object, timeoutMs = quick): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let ws: WebSocket;
      try { ws = new WebSocket(socketUrl()); }
      catch { return reject(new EimzoError('undastur', 'E-IMZO javob bermayapti')); }
      let answered = false;
      const timer = setTimeout(() => { ws.close(); reject(new EimzoError('undastur', 'E-IMZO vaqtida javob bermadi')); }, timeoutMs);
      ws.onopen = () => ws.send(JSON.stringify(request));
      ws.onmessage = (ev) => {
        answered = true; clearTimeout(timer); ws.close();
        let reply: Reply<T>;
        try { reply = JSON.parse(ev.data as string); }
        catch { return reject(new EimzoError('rad', 'E-IMZO javobi o‘qilmadi')); }
        if (reply.success === false) return reject(new EimzoError('rad', reply.reason ?? 'E-IMZO rad etdi'));
        resolve(reply);
      };
      ws.onerror = () => { clearTimeout(timer); if (!answered) reject(new EimzoError('undastur', 'E-IMZO javob bermayapti')); };
      ws.onclose = (ev) => { clearTimeout(timer); if (!answered && ev.code !== 1000) reject(new EimzoError('undastur', 'E-IMZO javob bermayapti')); };
    });
  }

  return {
    async getVersion() {
      const r = await call<{ major?: string; minor?: string }>({ name: 'version' });
      return { major: Number(r.major ?? 0), minor: Number(r.minor ?? 0) };
    },

    /** Versiyani tekshiradi, domen kalitlarini ro'yxatdan o'tkazadi. Versiyani bitta son qilib qaytaradi (4.86 → 486). */
    async prepare(): Promise<number> {
      const { major, minor } = await this.getVersion();
      const v = major * 100 + minor;
      if (v < MINIMUM_VERSION) throw new EimzoError('rad', 'E-IMZO versiyasi eski');
      const args = Object.entries(options.apiKeys).flat();
      await call({ name: 'apikey', arguments: args });
      return v;
    },

    async listKeys(): Promise<EimzoKey[]> {
      const keys: EimzoKey[] = [];
      const pfx = await call<{ certificates?: Array<{ disk: string; path: string; name: string; alias: string }> }>({ plugin: 'pfx', name: 'list_all_certificates' });
      (pfx.certificates ?? []).forEach((c, i) => {
        const k = keyFromDescription('pfx', [c.disk, c.path, c.name, c.alias], c.alias, i);
        if (k) keys.push(k);
      });
      try {
        const t = await call<{ tokens?: Array<{ cardUID: string; info: string }> }>({ plugin: 'ftjc', name: 'list_all_keys', arguments: [''] });
        (t.tokens ?? []).forEach((tok, i) => {
          const k = keyFromDescription('ftjc', [tok.cardUID], tok.info, i);
          if (k) keys.push(k);
        });
      } catch { /* token yo'q — xato emas */ }
      return keys;
    },

    async openKey(key: EimzoKey): Promise<string> {
      const r = await call<{ keyId?: string }>({ plugin: key.kind, name: 'load_key', arguments: key.locator }, slow);
      if (!r.keyId) throw new EimzoError('rad', 'E-IMZO kalitni qaytarmadi');
      if (key.kind === 'ftjc') await call({ plugin: 'ftjc', name: 'verify_pin', arguments: [r.keyId, '1'] }, slow);
      return r.keyId;
    },

    /** Attached PKCS7. keyId o'rniga 'idcard' | 'baikey' | 'ckc' ham berish mumkin. */
    async signBase64(keyId: string, base64: string, detached = false): Promise<string> {
      const r = await call<{ pkcs7_64?: string }>({ plugin: 'pkcs7', name: 'create_pkcs7', arguments: [base64, keyId, detached ? 'yes' : 'no'] }, slow);
      if (!r.pkcs7_64) throw new EimzoError('rad', 'E-IMZO imzoni qaytarmadi');
      return r.pkcs7_64;
    },

    sign(keyId: string, text: string, detached = false) {
      return this.signBase64(keyId, toBase64(text), detached);
    },
  };
}
