# 2. O'rnatish va tekshirish

## Foydalanuvchi tomonida
- E-IMZO [e-imzo.uz](https://e-imzo.uz) dan yuklab olinadi (Windows, macOS, Linux).
- O'rnatilgach, fon rejimida ishlaydi va `127.0.0.1` da tinglaydi.

## Sahifa tomonida: ishlayaptimi?
Eng birinchi so'rov — versiya:
```json
{ "name": "version" }
```
Javob: `{ "success": true, "major": "6", "minor": "4" }` (matn ko'rinishida keladi, raqamga aylantiring).

### Holatlarni ajrating
| Holat | Belgisi | Foydalanuvchiga |
|-------|---------|-----------------|
| Dastur yo'q / ishlamayapti | socket `onerror` yoki `onclose` (kod ≠ 1000) javobsiz | "E-IMZO o'rnating yoki ishga tushiring" |
| Javob kechikdi | timeout | "E-IMZO javob bermadi, qayta urinib ko'ring" |
| Eski versiya | `major*100+minor < 336` | "E-IMZO ni yangilang" |
| Dastur rad etdi | `success: false` + `reason` | `reason` ni ko'rsating (08-xatolar.md) |

## Minimal versiyalar (rasmiy klientdagi `NEW_API*` konstantalaridan)
| Imkoniyat | Minimal versiya |
|-----------|-----------------|
| Kalitlar ro'yxati (`list_all_certificates`) | 3.36 |
| ID-karta | 4.12 |
| BAIK / CKC tokenlar | 4.86 |

## Domen kalitlarini ro'yxatdan o'tkazish
Versiyadan keyin, har qanday boshqa so'rovdan oldin:
```json
{ "name": "apikey", "arguments": ["localhost", "<kalit>", "127.0.0.1", "<kalit>", "sizning.domen.uz", "<kalit>"] }
```
Argumentlar juft-juft: domen, kalit, domen, kalit.

> **Kalitni qayerdan olish:** `localhost`/`127.0.0.1` uchun rasmiy integratsiya qo'llanmasidan. Real domen uchun E-IMZO operatoriga murojaat qilinadi. <!-- TODO: murojaat tartibi -->

## Timeout tavsiyasi
- Oddiy so'rovlar (versiya, ro'yxat): **20 soniya**. USB token sekin portda birinchi javobni kechiktiradi, 10 soniya yetmaydi.
- Parol so'raladigan so'rovlar (`load_key`, `create_pkcs7`): **5 daqiqa** yoki undan ko'p. E-IMZO oynasi parolni kutadi, timeout foydalanuvchini yarim yo'lda uzib qo'ymasin.

## E-IMZO 6 va avtomatik kalit
E-IMZO 6 dan boshlab dastur ochiq sahifa domeni uchun API kalitni o'zi yuklab olishi mumkin. Eski versiyalar uchun `apikey` so'rovi majburiy — shuning uchun uni har doim yuboring, zarar qilmaydi. *(Manba: e-imzo-doc §0.3, §1.1)*

## Windows: E-IMZO ishga tushmayapti
Sabab ko'pincha Windows'ning dinamik TCP port oralig'i tor bo'lishi. Administrator sifatida:
```
netsh int ipv4 show dynamicport tcp
netsh int ipv4 set dynamicport tcp start=1025 num=64510
```
*(Manba: e-imzo-doc §4.2)*

> **Tekshirildi:** E-IMZO 5.0, macOS, Chromium, `http://localhost` (ws://127.0.0.1:64646). `version`, `apikey`, `pfx.list_all_certificates`, `pfx.load_key`, `pkcs7.create_pkcs7` — hammasi `examples/vanilla` demo orqali, 2026-11-06.
