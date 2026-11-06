# 5. Hujjat imzolash (PKCS7)

## Oddiy oqim
1. `openKey` → `pfx.load_key` yoki `ftjc.load_key` → `keyId`.
2. Token bo'lsa `ftjc.verify_pin`.
3. `pkcs7.create_pkcs7` → `[base64(ma'lumot), keyId, 'no']` → `pkcs7_64`.
4. `pkcs7_64` ni backendga yuboring, backend tekshiradi.

## Attached yoki detached?
- `'no'` → **attached**: ma'lumot PKCS7 ichida. Server aynan nimaga imzo qo'yilganini ko'ra oladi. Login challenge, JSON hujjatlar uchun — odatda shu.
- `'yes'` → **detached**: faqat imzo. Katta fayllar uchun.

## Base64 tuzog'i
`btoa` faqat baytlar bilan ishlaydi. Kirill/o'zbek harflari bo'lsa oldin UTF-8 ga o'tkazing:
```ts
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
```
Eski loyihalarda `btoa(unescape(encodeURIComponent(s)))` ko'rinishi uchraydi — ishlaydi, lekin `unescape` eskirgan.

**Server bergan base64 ni o'zgartirmasdan imzolang.** Decode-encode qilsangiz bayt o'zgarishi va serverdagi digest mos kelmasligi mumkin. Rasmiy klientda buning uchun `isDataBase64Encoded` bayrog'i bor.

## Imzolashdan oldin hujjatni tozalang
Imzolangan baytlar keyin o'zgartirilmaydi — backend uni ko'pincha o'zgarishsiz uzatadi (masalan, roumingga). Shuning uchun:
- faqat spetsifikatsiyada bor maydonlarni yuboring (whitelist);
- bo'sh sub-obyektlarni `null` qiling, raqam kutilgan joyga `""` yubormang;
- bu tekshiruvni **forma emas, imzolash funksiyasi** qilsin — ommaviy imzolash va import formani chetlab o'tadi.

## Parol qachon so'raladi
- **PFX:** `load_key` da emas, birinchi `create_pkcs7` da E-IMZO oynasi so'raydi. Shu oynada "6 soat eslab qolish" katagi bor. `verify_password` esa har safar so'raydi va eslab qolishni taklif qilmaydi. Ko'p hujjat imzolaydigan ilovada `verify_password` o'rniga bitta "sinov" imzo qilib qo'yish qulayroq. Rasmiy klientning `loadKey(…, verifyPassword=true)` yo'li aynan `verify_password` ni chaqiradi — bilib ishlating.
- **Token:** PIN `verify_pin` da so'raladi.

## keyId ni keshlash va qayta urinish
`keyId` sessiya ichida yashaydi, E-IMZO qayta ishga tushsa yoki vaqt o'tsa o'ladi. Real loyihalarda ishlagan naqsh:
1. STIR → `keyId` lug'atini saqlang (store yoki `sessionStorage`).
2. Imzolashda keshdagi `keyId` bilan urinib ko'ring.
3. Rad etsa — keshdan o'chiring, `load_key` qayta, yana imzolang.
4. Ikkinchi marta ham rad etsa — foydalanuvchiga "parol noto'g'ri yoki E-IMZO yopiq" deng.

## Ommaviy imzolash
Bir nechta hujjatni **ketma-ket** imzolang, `Promise.all` emas: E-IMZO bitta parol oynasi ochadi, parallel so'rovlar bir-birini kutib qoladi. Birinchi imzoda parol so'raladi, qolganlari (eslab qolish yoqilgan bo'lsa) oynasiz o'tadi. Muvaffaqiyat va xato indekslarini alohida yig'ing, bittasi yiqilsa qolganini to'xtatmang.

## Vaqt tamg'asi (TSA)
Ba'zi tizimlar (soliq, rouming) imzoda vaqt tamg'asi bo'lishini talab qiladi. Oqim:
1. `create_pkcs7` → `pkcs7_64`, `signer_serial_number`, `signature_hex`.
2. `pkcs7_64` ni **o'z backendingizga** yuborasiz, backend TSA serverdan tamg'a olib, tamg'ali `pkcs7` qaytaradi. (Frontend TSA ga to'g'ridan-to'g'ri bormaydi.)
3. Yoki: backend faqat `tst` qaytarsa — `attach_timestamp_token_pkcs7` `[pkcs7_64, signer_serial_number, tst]` bilan E-IMZO o'zi biriktiradi.

Rasmiy klientda `createPkcs7(id, data, timestamper, success, fail, detached, isDataBase64Encoded)` — `timestamper` ana shu callback. Kerak bo'lmasa `null` bering.

## Ikkinchi imzo (qarshi tomon tasdiqlashi)
Hujjatni sotuvchi imzolagan, xaridor "qabul qilaman" deydi — yangi PKCS7 emas, mavjudiga imzo qo'shiladi:
- `pkcs7.append_pkcs7_attached` `[mavjud_pkcs7_64, keyId]` → yangi `pkcs7_64` ikki imzo bilan.
- Muqobil: xaridor asl hujjatni (base64) alohida imzolaydi, backend ikkita PKCS7 ni birlashtiradi (`join`). Qaysi yo'l — backend spetsifikatsiyasiga bog'liq.

## Imzodan ma'lumot o'qish
`pkcs7.pkcs7_info` `[pkcs7_64]` — imzolovchi sertifikatini (JShShIR, STIR, F.I.Sh.) qaytaradi. ID-karta bilan kirishda kerak: karta ro'yxatda ko'rinmaydi, kim ekani faqat imzodan ma'lum bo'ladi. <!-- TODO: javob maydonlari -->

## Qurilma bilan imzolash
ID-karta, BAIK, CKC uchun `keyId` o'rniga `'idcard'`, `'baikey'`, `'ckc'`. PIN ni E-IMZO o'zi so'raydi. Batafsil: 06-id-karta-va-qurilmalar.md.
