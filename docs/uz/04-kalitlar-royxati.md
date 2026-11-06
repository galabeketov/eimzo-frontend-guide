# 4. Kalitlar ro'yxati

Foydalanuvchiga tanlash uchun kalitlar ro'yxati ikki manbadan yig'iladi:
1. **PFX fayllar** — `pfx.list_all_certificates`. Disklar va fleshkalardagi fayllar.
2. **USB tokenlar** — `ftjc.list_all_keys`. Token yo'q bo'lsa plugin **rad etadi** — bu xato emas, ro'yxatni bo'sh qoldiring, PFX ro'yxatini ko'mib yubormang.

## X.500 satrni ajratish
E-IMZO sertifikatni X.500 satr bilan tavsiflaydi:
```
CN=ISMI FAMILIYASI,O=TASHKILOT NOMI,T=Direktor,UID=123456789,1.2.860.3.16.1.2=12345678901234,VALIDTO=2027.01.01 00:00:00
```

**Tuzoq:** vergul bo'yicha oddiy `split(',')` qilmang — tashkilot nomida vergul bo'lishi mumkin. Keyingi maydon nomidan **oldingi** vergul bo'yicha ajrating:
```ts
x500.split(/,(?=[A-Za-z0-9.]+=)/)
```

## O'zbekistonga xos OID'lar
| Maydon | Qayerda |
|--------|---------|
| JShShIR (PINFL) | `1.2.860.3.16.1.2` |
| STIR (yuridik shaxs) | `1.2.860.3.16.1.1` |
| STIR (jismoniy shaxs) | `UID` |
| F.I.Sh. | `CN` |
| Tashkilot | `O` |
| Lavozim | `T` |
| Amal qilish muddati | `VALIDTO` (`yyyy.MM.dd HH:mm:ss`) |

STIR qoidasi assimetrik: tashkilotniki OID ostida, jismoniy shaxsniki `UID` da. Shu orqali ikki tur sertifikatni ajratish mumkin.

Na JShShIR, na STIR bo'lmagan kalit — kimnidir autentifikatsiya qila olmaydi, rasmiy klient ham uni ro'yxatdan tashlab yuboradi.

## Ro'yxatni ko'rsatish bo'yicha tavsiyalar
- Sarlavha: tashkilot bo'lsa tashkilot nomi, bo'lmasa F.I.Sh.
- Muddati tugaganlarni ro'yxat oxiriga suring, 30 kun qolganlarini ogohlantirish rangida ko'rsating.
- Qidiruv: lotin/kirill ikkala alifboda.
