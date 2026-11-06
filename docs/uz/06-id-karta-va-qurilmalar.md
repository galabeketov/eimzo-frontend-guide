# 6. ID-karta va qurilmalar

## Farqi
PFX va ftjc kalitlar **ro'yxatda** ko'rinadi (F.I.Sh., STIR). ID-karta, BAIK, CKC esa ko'rinmaydi — faqat "qurilma ulangan" degan belgi bor. Kim ekani imzo qilingandan keyin, `pkcs7_info` orqali ma'lum bo'ladi.

## Ulanganini tekshirish
| Qurilma | So'rov | Javob | Min. versiya |
|---------|--------|-------|--------------|
| ID-karta | `{plugin:'idcard', name:'list_readers'}` | `readers[]` bo'sh emas | 4.12 |
| BAIK | `{plugin:'baikey', name:'list_tokens'}` | `tokens[]` | 4.86 |
| CKC | `{plugin:'ckc', name:'list_ckc'}` | `devices[]` | 4.86 |

Har birini **alohida va jim** so'rang: driver yo'q bo'lsa plugin rad etadi, bu boshqa qurilmalarni yashirishga sabab emas. O'rnatilgan versiya minimaldan past bo'lsa so'ramang.

## Imzolash
```json
{ "plugin": "pkcs7", "name": "create_pkcs7", "arguments": ["<base64>", "idcard", "no"] }
```
`keyId` o'rniga qurilma nomi. PIN oynasini E-IMZO o'zi ochadi. `load_key` kerak emas.

## Xato: noto'g'ri PIN
`reason` ichida `BadPaddingException` bo'lsa — PIN noto'g'ri. Foydalanuvchiga shuni deng, "server xatosi" demang.

## ID-karta bilan kirish (login)
1. Backenddan challenge oling.
2. `create_pkcs7` `[base64(challenge), 'idcard', 'no']`.
3. Backend imzoni tekshiradi, sertifikatdan JShShIR oladi.
4. Frontend ham kerak bo'lsa `pkcs7_info` bilan imzodan F.I.Sh./JShShIR o'qib UI da ko'rsatadi.

UI maslahat: kalit tanlash ro'yxatida "ID-karta" ni alohida qator qilib, faqat `list_readers` bo'sh bo'lmaganda ko'rsating.

<!-- TODO: mobil oqim (E-IMZO mobil ilova, QR) — alohida bo'lim -->
<!-- TODO: BAIK/CKC sertifikat ro'yxati (`baikey.list_all_certificates`) -->

## ID-karta emulyatori (test uchun) *(Manba: e-imzo-doc §1.4)*
Jismoniy karta va o'quvchi bo'lmasa ham ID-karta oqimini sinash mumkin:
1. E-IMZO tray menyusi → Разработка → Эмулятор ID-карты.
2. Manzil: `wss://test.e-imzo.uz/idcard-emulator`, Enable → tasdiqlash.
3. Har yoqishda bo'sh virtual karta yaratiladi. Test kalitni `test.e-imzo.uz/registrator/public/ckc.html` da yarating.
4. Sayt uni jismoniy karta kabi chaqiradi: `create_pkcs7` da `id = 'idcard'` yoki `'ckc'`.

Bu kalitlar **test** kalitlari, prod imzo uchun yaroqsiz.

## Mobil oqim
ID-karta + NFC telefon + E-IMZO mobil ilova orqali kirish va imzolash alohida REST API (`/frontend/mobile/*`, deeplink, status polling). Frontend bu yerda faqat deeplink yasaydi va statusni so'raydi; batafsil va status kodlari jadvali: [e-imzo-doc §3](https://github.com/qo0p/e-imzo-doc#3-id-card-e-imzo-mobile-rest-api).
