/**
 * To'liq misol: holat → kalit tanlash → imzolash → natija.
 * Domen kalitlarini o'zingizniki bilan almashtiring.
 */
import { useState } from 'react';
import { useEimzo } from './useEimzo';
import { EimzoKeyPicker } from './EimzoKeyPicker';
import { EimzoError, type EimzoKey } from '../vanilla/eimzo-client';

const API_KEYS = {
  localhost: '<rasmiy qo‘llanmadagi localhost kaliti>',
  '127.0.0.1': '<rasmiy qo‘llanmadagi 127.0.0.1 kaliti>',
};

export function SignDemo() {
  const { status, version, keys, error, refresh, sign } = useEimzo({ apiKeys: API_KEYS });
  const [selected, setSelected] = useState<EimzoKey | null>(null);
  const [text, setText] = useState('Salom, E-IMZO!');
  const [pkcs7, setPkcs7] = useState('');
  const [signError, setSignError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'checking') return <p>E-IMZO tekshirilmoqda…</p>;
  if (status === 'unavailable') return (
    <p>E-IMZO topilmadi. <a href="https://e-imzo.uz" target="_blank" rel="noreferrer">O'rnating</a> yoki ishga tushiring, keyin <button onClick={refresh}>qayta tekshiring</button>.</p>
  );
  if (status === 'outdated') return <p>E-IMZO versiyasi eskirgan, yangilang. <button onClick={refresh}>Qayta tekshirish</button></p>;
  if (status === 'error') return <p>E-IMZO rad etdi: {error} <button onClick={refresh}>Qayta</button></p>;

  async function onSign() {
    if (!selected) return;
    setBusy(true); setSignError(''); setPkcs7('');
    try {
      setPkcs7(await sign(selected, text));
    } catch (e) {
      // 'undastur' — E-IMZO yopilib qolgan; 'rad' — parol bekor/noto'g'ri
      setSignError(e instanceof EimzoError && e.kind === 'undastur'
        ? 'E-IMZO javob bermayapti. Dastur ochiqligini tekshiring.'
        : 'Imzolab bo‘lmadi. Parolni tekshirib, qayta urinib ko‘ring.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <p style={{ color: '#6b7280' }}>E-IMZO {Math.floor((version ?? 0) / 100)}.{(version ?? 0) % 100} · {keys.length} ta kalit</p>
      <EimzoKeyPicker keys={keys} selectedId={selected?.id ?? null} onSelect={setSelected} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} style={{ width: '100%', marginTop: 12 }} />
      <button onClick={onSign} disabled={!selected || busy} style={{ marginTop: 8 }}>
        {busy ? 'Imzolanmoqda…' : 'Imzolash'}
      </button>
      {signError && <p style={{ color: '#dc2626' }}>{signError}</p>}
      {pkcs7 && (
        <details open style={{ marginTop: 12 }}>
          <summary>PKCS7 (base64, {pkcs7.length} belgi)</summary>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 11 }}>{pkcs7}</pre>
        </details>
      )}
    </div>
  );
}
