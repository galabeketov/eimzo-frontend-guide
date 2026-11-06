# 8. Xatolar lug'ati

Ikki tur xatoni ajrating — foydalanuvchi uchun bu boshqa-boshqa yangilik:
- **Dastur yo'q** (`undastur`): socket ochilmadi, timeout, `onclose` kodi ≠ 1000 javobsiz. Yechim: o'rnatish/ishga tushirish.
- **Dastur rad etdi** (`rad`): `success: false`, `reason` bor. Yechim: kalit, parol, versiya bilan bog'liq.

| `reason` matni (E-IMZO) | Qachon | Nima qilish | Tekshirilgan |
|--------------------------|--------|-------------|--------------|
| *(socket ochilmadi)* | E-IMZO ishlamayapti | "E-IMZO ni ishga tushiring" | 6.4.x |
| *(timeout)* | javob kelmadi | qayta urinish | 6.4.x |
| eski versiya (`< 3.36`) | `version` | "yangilang" | 6.4.x |
| `keyId` qaytmadi | `load_key` | kalit fayli buzilgan yoki o'chirilgan | 6.4.x |
| `pkcs7_64` qaytmadi | `create_pkcs7` | parol bekor qilindi | 6.4.x |
| token rad etdi (`list_all_keys`) | token yo'q | xato emas, bo'sh ro'yxat | 6.4.x |

<!-- TODO: aniq `reason` matnlarini to'plash. Issue shablonini ishlating. -->
