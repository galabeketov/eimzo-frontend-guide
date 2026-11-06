# 1. E-IMZO qanday ishlaydi

## Qisqacha
E-IMZO — foydalanuvchi kompyuteriga o'rnatiladigan dastur (Java asosida, JRE bilan keladi). Brauzerdagi sahifa unga **WebSocket** orqali, `127.0.0.1` manziliga murojaat qiladi. Imzo foydalanuvchi kompyuterida yaratiladi, kalit paroli E-IMZO oynasida teriladi, serverga faqat tayyor imzo (PKCS7) boradi.

```
Brauzer (sahifa) ──WebSocket──▶ 127.0.0.1:64443 (E-IMZO dasturi)
       │                               │
       │◀── JSON javob ────────────────┘
       │
       └──HTTP──▶ Sizning backend (imzoni tekshiradi)
```

## Asosiy tamoyillar
- **Bitta chaqiruv — bitta socket.** Har so'rov uchun socket ochiladi, JSON yuboriladi, javob olinadi, yopiladi. Doimiy ulanish yo'q.
- **Port sahifa protokoliga bog'liq.** `https` → `wss://127.0.0.1:64443`, `http` → `ws://127.0.0.1:64646`. Yo'l: `/service/cryptapi`.
- **Javob shakli:** `{ success: boolean, reason?: string, ...ma'lumot }`.
- **Domen kaliti (API key).** E-IMZO sahifa domeniga bog'langan kalitsiz ishlamaydi. `localhost` / `127.0.0.1` uchun kalitlar rasmiy qo'llanmada e'lon qilingan. Real domen uchun kalit E-IMZO operatoridan olinadi. Kalit sir emas — bundle ichida har brauzerga boradi.

## Foydalanuvchida nima bo'lishi kerak
1. E-IMZO o'rnatilgan va ishlab turgan.
2. Kalit: PFX fayl, USB token (ftjc), ID-karta yoki BAIK/CKC qurilma.

## Ikki yondashuv: rasmiy klient yoki o'z klientingiz

### A. Rasmiy `e-imzo.js` + `e-imzo-client.js`
`index.html` ga ikkita `<script>` qo'shiladi, `window.EIMZOClient` va `window.CAPIWS` paydo bo'ladi. `EIMZOClient.API_KEYS` ni o'z domeningiz bilan to'ldirasiz, `checkVersion → installApiKeys → listAllUserKeys → loadKey → createPkcs7` zanjirini callback'lar bilan chaqirasiz.

Afzalligi: tez boshlanadi, rasmiy. Kamchiliklari:
- `Date.prototype`, `String.prototype` ga metod qo'shadi, `window.dates` kabi globalalar yaratadi — SPA da begona o'zgarish;
- callback uslubi (`success, fail`), Promise yo'q, tiplar yo'q;
- versiyasi yo'q, yangilanganini bilish qiyin;
- `loadKey` ichida `verify_password` chaqiradi — parol har safar so'raladi (05-imzolash.md).

Ko'p React loyihalari shu yo'lda: Provider komponent `useEffect` da versiya tekshiradi, kalitlarni store'ga yozadi, `putSignature(data, key)` kabi Promise o'ramlari yoziladi.

### B. O'z klientingiz (protokol bo'yicha)
Protokol o'nga yaqin oddiy JSON xabar. `examples/vanilla/eimzo-client.ts` — ~150 qator, Promise, tiplar, globalasiz. Tavsiya: yangi loyiha uchun B, eski loyihada A ni Promise bilan o'rab ishlating.

<!-- TODO: E-IMZO oynalari skrinshotlari -->
