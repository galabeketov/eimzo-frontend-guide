/**
 * React hook: E-IMZO holati, kalitlar ro'yxati va imzolash.
 * Vanilla yadro ustida yupqa qatlam — UI kutubxonasiga bog'liq emas.
 *
 * Holatlar:
 *   checking    — versiya so'ralmoqda
 *   ready       — kalitlar yuklangan, imzolash mumkin
 *   unavailable — E-IMZO o'rnatilmagan yoki ishlamayapti
 *   outdated    — versiya 3.36 dan past
 *   error       — boshqa rad (reason bilan)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createEimzoClient, EimzoError, type EimzoKey, type EimzoClientOptions } from '../vanilla/eimzo-client';

export type EimzoStatus = 'checking' | 'ready' | 'unavailable' | 'outdated' | 'error';

export interface UseEimzoResult {
  status: EimzoStatus;
  version: number | null;
  keys: EimzoKey[];
  error: string | null;
  /** Versiyani qayta tekshirib, kalitlarni qayta yuklaydi (E-IMZO ishga tushgandan keyin). */
  refresh: () => Promise<void>;
  /** Tanlangan kalit bilan matnni imzolaydi (attached PKCS7). Parolni E-IMZO oynasi so'raydi. */
  sign: (key: EimzoKey, text: string) => Promise<string>;
}

export function useEimzo(options: EimzoClientOptions): UseEimzoResult {
  const clientRef = useRef(createEimzoClient(options));
  // keyId keshi: bir sessiyada bitta kalit uchun load_key bir marta.
  const keyIdsRef = useRef(new Map<string, string>());

  const [status, setStatus] = useState<EimzoStatus>('checking');
  const [version, setVersion] = useState<number | null>(null);
  const [keys, setKeys] = useState<EimzoKey[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('checking');
    setError(null);
    keyIdsRef.current.clear();
    try {
      const v = await clientRef.current.prepare();
      setVersion(v);
      setKeys(await clientRef.current.listKeys());
      setStatus('ready');
    } catch (e) {
      const err = e instanceof EimzoError ? e : new EimzoError('rad', String(e));
      setError(err.message);
      if (err.kind === 'undastur') setStatus('unavailable');
      else if (/versiya/i.test(err.message)) setStatus('outdated');
      else setStatus('error');
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const sign = useCallback(async (key: EimzoKey, text: string) => {
    const client = clientRef.current;
    const cached = keyIdsRef.current.get(key.id);
    if (cached) {
      try {
        return await client.sign(cached, text);
      } catch {
        // keyId eskirgan (E-IMZO qayta ishga tushgan) — keshni tashlab, qayta ochamiz
        keyIdsRef.current.delete(key.id);
      }
    }
    const keyId = await client.openKey(key);
    keyIdsRef.current.set(key.id, keyId);
    return client.sign(keyId, text);
  }, []);

  return { status, version, keys, error, refresh, sign };
}
