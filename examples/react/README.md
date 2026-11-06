# React misoli

Vanilla yadro (`../vanilla/eimzo-client.ts`) ustida uchta fayl. UI kutubxonasiga bog'liq emas, stil minimal.

| Fayl | Nima |
|------|------|
| `useEimzo.ts` | Hook: holat (`checking / ready / unavailable / outdated / error`), versiya, kalitlar, `refresh()`, `sign(key, text)`. `keyId` ni keshlaydi, eskirsa jim qayta ochadi. |
| `EimzoKeyPicker.tsx` | Kalit ro'yxati: muddati tugaganlar oxirida va o'chirilgan, 30 kun qolganlar sariq. |
| `SignDemo.tsx` | To'liq oqim: holat → kalit → matn → PKCS7. |

## Ulash
```bash
cp -r examples/vanilla examples/react src/eimzo/
```
```tsx
import { SignDemo } from './eimzo/react/SignDemo';
```
`SignDemo.tsx` ichidagi `API_KEYS` ga o'z domeningiz kalitini qo'shing.

## Xatolarni qanday ko'rsatish
`EimzoError.kind` ikki xil:
- `undastur` → "E-IMZO ni ishga tushiring" + qayta tekshirish tugmasi;
- `rad` → "parolni tekshiring" (reason ni foydalanuvchiga ko'rsatish shart emas, u ruscha/inglizcha texnik matn).

## Nimalar yo'q (PR kutiladi)
- ID-karta qatori (`list_readers` bo'yicha) — 06-bo'limga qarang.
- Ommaviy imzolash (ketma-ket) namunasi.
- Testlar (`keyFromDescription` uchun oddiy unit test yetarli boshlanish).
