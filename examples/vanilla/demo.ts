/**
 * Demo: index.html bilan birga. `npx vite examples/vanilla` deb ishga tushiring.
 * localhost / 127.0.0.1 kalitlari rasmiy qo'llanmada e'lon qilingan (e-imzo-doc §1.1).
 */
import { createEimzoClient, EimzoError, type EimzoKey } from './eimzo-client';

const eimzo = createEimzoClient({
  apiKeys: {
    localhost: '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
    '127.0.0.1': 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
  },
});

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const log = (line: string) => { $('log').textContent += `${new Date().toLocaleTimeString()}  ${line}\n`; };

let keys: EimzoKey[] = [];
let selected: EimzoKey | null = null;
const keyIds = new Map<string, string>();

function renderKeys() {
  const box = $('keys');
  box.innerHTML = '';
  if (keys.length === 0) { box.innerHTML = '<p class="muted">Kalit topilmadi.</p>'; return; }
  for (const key of keys) {
    const ended = key.validUntil ? key.validUntil.getTime() < Date.now() : false;
    const btn = document.createElement('button');
    btn.className = (selected?.id === key.id ? 'selected ' : '') + (ended ? 'ended' : '');
    btn.disabled = ended;
    btn.innerHTML = `<strong>${key.organisation || key.fullName}</strong><div class="muted">${key.pinfl ? 'JShShIR ' + key.pinfl + ' · ' : ''}${key.tin ? 'STIR ' + key.tin + ' · ' : ''}${key.kind} · ${key.validUntil?.toLocaleDateString('uz-UZ') ?? '?'}</div>`;
    btn.onclick = () => { selected = key; $('sign').toggleAttribute('disabled', false); renderKeys(); };
    box.appendChild(btn);
  }
}

async function refresh() {
  $('status').textContent = 'Tekshirilmoqda…'; $('error').textContent = ''; keyIds.clear();
  try {
    const v = await eimzo.prepare();
    log(`version OK → ${Math.floor(v / 100)}.${v % 100}, apikey OK`);
    keys = await eimzo.listKeys();
    log(`listKeys → ${keys.length} ta`);
    $('status').textContent = `E-IMZO ${Math.floor(v / 100)}.${v % 100} · ${keys.length} ta kalit`;
    renderKeys();
  } catch (e) {
    const err = e instanceof EimzoError ? e : new EimzoError('rad', String(e));
    log(`XATO [${err.kind}] ${err.message}`);
    $('status').textContent = err.kind === 'undastur' ? 'E-IMZO topilmadi yoki ishlamayapti' : `E-IMZO rad etdi: ${err.message}`;
  }
}

async function sign() {
  if (!selected) return;
  $('error').textContent = ''; $('result').hidden = true;
  const text = ($('text') as HTMLTextAreaElement).value;
  try {
    let keyId = keyIds.get(selected.id);
    if (!keyId) { keyId = await eimzo.openKey(selected); keyIds.set(selected.id, keyId); log(`load_key → keyId ${keyId.slice(0, 8)}…`); }
    const t0 = performance.now();
    const pkcs7 = await eimzo.sign(keyId, text);
    log(`create_pkcs7 → ${pkcs7.length} belgi, ${Math.round(performance.now() - t0)} ms`);
    $('pkcs7').textContent = pkcs7; $('result').hidden = false;
  } catch (e) {
    const err = e instanceof EimzoError ? e : new EimzoError('rad', String(e));
    log(`XATO [${err.kind}] ${err.message}`);
    $('error').textContent = err.kind === 'undastur' ? 'E-IMZO javob bermayapti.' : `Imzolab bo‘lmadi: ${err.message}`;
    if (err.kind === 'rad') keyIds.delete(selected.id);
  }
}

$('refresh').onclick = refresh;
$('sign').onclick = sign;
// Sinov uchun konsoldan: window.eimzoDemo.sign()
(window as any).eimzoDemo = { eimzo, refresh, sign, get keys() { return keys; }, select(i: number) { selected = keys[i]; renderKeys(); } };
void refresh();
