# 5. Hujjat imzolash (PKCS7)

## Oqim
1. `openKey` → `pfx.load_key` yoki `ftjc.load_key` → `keyId`.
2. Token bo'lsa `ftjc.verify_pin`.
3. `pkcs7.create_pkcs7` → `[base64(ma'lumot), keyId, 'no']` → `pkcs7_64`.
4. `pkcs7_64` ni backendga yuboring, backend tekshiradi.

## Attached yoki detached?
- `'no'` → **attached**: imzolangan ma'lumot PKCS7 ichida. Server aynan nimaga imzo qo'yilganini ko'ra oladi. Login challenge va qisqa hujjatlar uchun tavsiya.
- `'yes'` → **detached**: faqat imzo, ma'lumot alohida. Katta fayllar uchun.

## Base64 tuzog'i
`btoa` faqat baytlar bilan ishlaydi. Kirill yoki o'zbek harflari bo'lsa oldin UTF-8 ga o'tkazing:
```ts
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
```
Server bergan base64 ni **o'zgartirmasdan** imzolang: decode-encode qilsangiz bayt o'zgarishi va serverdagi digest mos kelmasligi mumkin.

## Parol qachon so'raladi
- PFX: `load_key` da **emas**, birinchi `create_pkcs7` da E-IMZO oynasi parol so'raydi. Shu oynada "6 soat eslab qolish" katagi bor. `verify_password` esa har safar so'raydi va eslab qolishni taklif qilmaydi — shuning uchun ko'p hujjat imzolaydigan ilovalarda `verify_password` o'rniga bitta "sinov" imzo qilib qo'yish qulayroq.
- Token: PIN `verify_pin` da so'raladi.

## Qurilma bilan imzolash
ID-karta, BAIK, CKC uchun `keyId` o'rniga qurilma nomi yuboriladi: `'idcard'`, `'baikey'`, `'ckc'`. PIN ni E-IMZO o'zi so'raydi. Batafsil: 06-id-karta-va-qurilmalar.md.
