# 8. Xatolar lug'ati

Ikki tur xatoni ajrating — foydalanuvchi uchun bu boshqa-boshqa yangilik:
- **Dastur yo'q** (`undastur`): socket ochilmadi, timeout, `onclose` kodi ≠ 1000 javobsiz. Yechim: o'rnatish/ishga tushirish.
- **Dastur rad etdi** (`rad`): `success: false`, `reason` bor. Yechim: kalit, parol, versiya.

| Belgisi | Qachon | Foydalanuvchiga | Tekshirilgan |
|---------|--------|-----------------|--------------|
| socket `onerror`/`onclose` javobsiz | E-IMZO ishlamayapti | "E-IMZO dasturini ishga tushiring" | 6.4.x |
| timeout | javob kelmadi (sekin token, osilib qolgan oyna) | "qayta urinib ko'ring" | 6.4.x |
| `major*100+minor < 336` | eski versiya | "E-IMZO ni yangilang" | 6.4.x |
| `reason: "E-IMZO Version is undefined"` | `version` javobida major/minor yo'q | "E-IMZO ni yangilang" | rasmiy klient |
| `reason` ichida `BadPaddingException` | PFX paroli yoki qurilma PIN i noto'g'ri | "Parol/PIN noto'g'ri" | fr_* loyihalar |
| `keyId` qaytmadi | `load_key` | kalit fayli buzilgan yoki o'chirilgan | 6.4.x |
| `pkcs7_64` qaytmadi | `create_pkcs7` | parol oynasi bekor qilindi | 6.4.x |
| `ftjc.list_all_keys` rad etdi | token yo'q | xato emas, bo'sh ro'yxat | 6.4.x |
| `idcard.list_readers` rad etdi | o'quvchi/driver yo'q | xato emas, ID-karta qatorini yashiring | 6.4.x |
| keshlangan `keyId` bilan imzo rad etildi | E-IMZO qayta ishga tushgan | jim `load_key` qayta, keyin xabar | ss_admin |
| `success:false` `apikey` da | domen kaliti yo'q/noto'g'ri | dasturchiga: shu domen uchun kalit oling | |

## Foydalanuvchiga matn namunalari (uz)
- "E-IMZO dasturi topilmadi yoki ishga tushmagan."
- "E-IMZO versiyasi eskirgan, iltimos yangilang."
- "Kalit bilan imzolab bo'lmadi. Parolni tekshirib, qayta urinib ko'ring."
- "Noto'g'ri PIN kod kiritildi."

<!-- TODO: aniq `reason` matnlarini to'plash. Issue shablonini ishlating. -->
