# 1. E-IMZO qanday ishlaydi

## Qisqacha
E-IMZO — foydalanuvchi kompyuteriga o'rnatiladigan dastur (Java asosida, JRE bilan birga keladi). Brauzerdagi sahifa unga **WebSocket** orqali, `127.0.0.1` manziliga murojaat qiladi. Imzo foydalanuvchi kompyuterida yaratiladi, kalit paroli E-IMZO oynasida teriladi, serverga faqat tayyor imzo (PKCS7) boradi.

```
Brauzer (sahifa) ──WebSocket──▶ 127.0.0.1:64443 (E-IMZO dasturi)
       │                               │
       │◀── JSON javob ────────────────┘
       │
       └──HTTP──▶ Sizning backend (imzoni tekshiradi)
```

## Asosiy tamoyillar
- **Bitta chaqiruv — bitta socket.** Rasmiy klient har bir so'rov uchun socket ochadi, JSON yuboradi, javob oladi, yopadi. Doimiy ulanish saqlanmaydi.
- **Port sahifa protokoliga bog'liq.** `https` sahifa → `wss://127.0.0.1:64443`, `http` sahifa → `ws://127.0.0.1:64646`. Aralash bo'lsa brauzer rad etadi.
- **Yo'l:** `/service/cryptapi`.
- **Javob shakli:** `{ success: boolean, reason?: string, ...ma'lumot }`. `success: false` bo'lsa `reason` ichida sabab.
- **Domen kaliti (API key).** E-IMZO sahifa domeniga bog'langan kalitsiz ishlamaydi. `localhost` va `127.0.0.1` uchun kalitlar rasmiy qo'llanmada e'lon qilingan. Real domen uchun kalit E-IMZO operatoridan olinadi. Kalit sir emas — u bundle ichida har bir brauzerga boradi.

## Foydalanuvchida nima bo'lishi kerak
1. E-IMZO o'rnatilgan va ishlab turgan bo'lishi.
2. Kalit: PFX fayl, USB token (ftjc), ID-karta yoki BAIK/CKC qurilma.

## Nega rasmiy `e-imzo-client.js` ni to'g'ridan-to'g'ri ishlatmaslik mumkin
Rasmiy fayl `Date.prototype` va `String.prototype` ga metod qo'shadi, global o'zgaruvchida yashaydi, tiplari va versiyasi yo'q. SPA ichida bu umumiy obyektlarga begona o'zgarish. Protokol esa o'nga yaqin oddiy xabardan iborat — uni o'zingiz yozish osonroq va xavfsizroq. Shu repodagi `examples/vanilla` ana shu yondashuv.

<!-- TODO: rasm/diagramma, E-IMZO oynalari skrinshotlari -->
