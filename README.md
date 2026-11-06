# E-IMZO frontend integratsiya qo'llanmasi

> O'zbekiston elektron raqamli imzo tizimi **E-IMZO** ni brauzer ilovasiga (vanilla JS, React, Vue, Angular) ulash bo'yicha hamjamiyat qo'llanmasi.
> Rasmiy emas. Real loyihalarda to'plangan tajriba asosida yozilgan. Xato topsangiz — PR yuboring.

🇺🇿 O'zbekcha (asosiy) · 🇷🇺 [Русский](docs/ru/README.md) · 🇬🇧 [English](docs/en/README.md)

## Nima uchun bu repo kerak

E-IMZO uchun rasmiy hujjat asosan backend (PKCS7 tekshirish, timestamp) haqida. Frontend tomoni — WebSocket protokoli, kalitlar ro'yxati, ID-karta, xatolar — tarqoq va ko'pincha ruscha. npm'dagi paketlar bitta frameworkka bog'langan va ko'pi eskirgan.

Bu repo:
- protokolni **frameworkdan mustaqil** tushuntiradi;
- har bir oqimni (kalit tanlash, imzolash, ID-karta, login) alohida yoritadi;
- xatolar lug'ati va brauzer tuzoqlarini jamlaydi;
- mavjud paketlarning holatini bir joyda ko'rsatadi.

## Mundarija

| # | Bo'lim | Holati |
|---|--------|--------|
| 1 | [E-IMZO qanday ishlaydi](docs/uz/01-qanday-ishlaydi.md) | ✍️ qoralama |
| 2 | [O'rnatish va tekshirish](docs/uz/02-ornatish-va-tekshirish.md) | ✍️ qoralama |
| 3 | [Protokol: xabarlar lug'ati](docs/uz/03-protokol.md) | ✍️ qoralama |
| 4 | [Kalitlar ro'yxati (PFX, token)](docs/uz/04-kalitlar-royxati.md) | ✍️ qoralama |
| 5 | [Hujjat imzolash (PKCS7)](docs/uz/05-imzolash.md) | ✍️ qoralama |
| 6 | [ID-karta va qurilmalar](docs/uz/06-id-karta-va-qurilmalar.md) | ✍️ qoralama |
| 7 | [Login oqimi (challenge)](docs/uz/07-login-oqimi.md) | ✍️ qoralama |
| 8 | [Xatolar lug'ati](docs/uz/08-xatolar.md) | ✍️ qoralama |
| 9 | [Brauzer tuzoqlari](docs/uz/09-brauzer-tuzoqlari.md) | ✍️ qoralama |
| 10 | [Mavjud paketlar](docs/uz/10-mavjud-paketlar.md) | ✍️ qoralama |
| 11 | [Atamalar lug'ati](docs/uz/11-atamalar.md) | ✍️ qoralama |

## Misollar

| Framework | Papka | Holati |
|-----------|-------|--------|
| Vanilla TS (yadro) | [examples/vanilla](examples/vanilla) | ✍️ qoralama |
| React | [examples/react](examples/react) | ✍️ qoralama (hook + kalit tanlash + demo) |
| Vue 3 | [examples/vue](examples/vue) | ✍️ qoralama (composable + kalit tanlash + demo) |
| Angular | [examples/angular](examples/angular) | ✍️ qoralama (service + kalit tanlash + demo) |

## Tez boshlash (3 daqiqa)

```ts
import { createEimzoClient } from './examples/vanilla/eimzo-client';

const eimzo = createEimzoClient({ apiKeys: { localhost: '<localhost kaliti>' } });
const version = await eimzo.prepare();     // versiya tekshiradi, domen kalitlarini ro'yxatdan o'tkazadi
const keys = await eimzo.listKeys();       // PFX fayllar + USB tokenlar
const keyId = await eimzo.openKey(keys[0]);
const pkcs7 = await eimzo.sign(keyId, 'imzolanadigan matn');
```

## Hissa qo'shish

[CONTRIBUTING.md](CONTRIBUTING.md) ga qarang. Eng kerakli yordam: xatolar lug'atiga yangi holat qo'shish, React/Vue/Angular misollari, ruscha va inglizcha tarjima.

## Litsenziya

MIT. Rasmiy `e-imzo.js` / `e-imzo-client.js` fayllari bu repoda **yo'q** — ularni [e-imzo.uz](https://e-imzo.uz) dan oling. Bu yerda faqat protokolning mustaqil tavsifi va o'z kodimiz.
