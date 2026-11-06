/**
 * Kalit tanlash ro'yxati. Stil minimal — o'z dizayningizga moslang.
 * Muddati tugaganlar oxirida va o'chirilgan, 30 kun qolganlar ogohlantiriladi.
 */
import type { EimzoKey } from '../vanilla/eimzo-client';

const DAY = 86_400_000;
const WARN_DAYS = 30;

type Term = 'valid' | 'ending' | 'ended' | 'unknown';

function termOf(key: EimzoKey, now = new Date()): Term {
  if (!key.validUntil) return 'unknown';
  const left = key.validUntil.getTime() - now.getTime();
  if (left <= 0) return 'ended';
  return left <= WARN_DAYS * DAY ? 'ending' : 'valid';
}

interface Props {
  keys: EimzoKey[];
  selectedId: string | null;
  onSelect: (key: EimzoKey) => void;
}

export function EimzoKeyPicker({ keys, selectedId, onSelect }: Props) {
  if (keys.length === 0) return <p>Kalit topilmadi. PFX faylni diskka joylang yoki tokenni ulang.</p>;

  const ordered = [...keys].sort((a, b) => Number(termOf(a) === 'ended') - Number(termOf(b) === 'ended'));

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {ordered.map((key) => {
        const term = termOf(key);
        const title = key.organisation || key.fullName || key.pinfl || key.tin;
        return (
          <li key={key.id}>
            <button
              type="button"
              disabled={term === 'ended'}
              onClick={() => onSelect(key)}
              aria-pressed={selectedId === key.id}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: 12, marginBottom: 8,
                border: selectedId === key.id ? '2px solid #2563eb' : '1px solid #d1d5db', borderRadius: 8,
                background: '#fff', cursor: term === 'ended' ? 'not-allowed' : 'pointer', opacity: term === 'ended' ? 0.5 : 1,
              }}
            >
              <strong>{title}</strong>
              <div style={{ fontSize: 13, color: '#4b5563' }}>
                {key.pinfl && <span>JShShIR {key.pinfl} · </span>}
                {key.tin && <span>STIR {key.tin} · </span>}
                {key.organisation && key.fullName && <span>{key.fullName} · </span>}
                {key.position && <span>{key.position} · </span>}
                <span>{key.kind === 'pfx' ? 'fayl' : 'token'}</span>
              </div>
              {key.validUntil && (
                <div style={{ fontSize: 12, color: term === 'ended' ? '#dc2626' : term === 'ending' ? '#d97706' : '#6b7280' }}>
                  {term === 'ended' ? 'Muddati tugagan: ' : term === 'ending' ? 'Muddati tugayapti: ' : 'Amal qiladi: '}
                  {key.validUntil.toLocaleDateString('uz-UZ')}
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
