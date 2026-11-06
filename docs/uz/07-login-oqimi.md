# 7. Login oqimi (challenge)

## Nima uchun challenge
Foydalanuvchi "men shu kalit egasiman" deb isbotlashi kerak. Server tasodifiy satr (challenge) beradi, foydalanuvchi uni imzolaydi, server imzoni va sertifikatni tekshiradi. Challenge bir martalik va muddatli — replay hujumidan himoya.

## Oqim
```
Frontend                       Backend
   │── GET /auth/challenge ───────▶│  tasodifiy satr + muddat
   │◀── { challenge } ─────────────│
   │
   │  E-IMZO: create_pkcs7(base64(challenge), keyId | 'idcard', 'no')
   │
   │── POST /auth/login { pkcs7 } ─▶│  imzo to'g'rimi? sertifikat amaldami?
   │                                │  challenge bizniki va muddati o'tmaganmi?
   │◀── { token, user } ───────────│  JShShIR/STIR bo'yicha foydalanuvchi
```

## Frontend tomonida e'tibor
- **Attached** imzolang (`'no'`): server challenge'ni imzo ichidan o'qiydi.
- Challenge'ni o'zgartirmang, trim qilmang — bayt-bayt.
- Kalit tanlangach `load_key`, keyin imzo. ID-karta bo'lsa `load_key` yo'q.
- Xatoni ikkiga ajrating: E-IMZO rad etdi (parol/PIN) vs server rad etdi (sertifikat muddati, foydalanuvchi yo'q).
- Muvaffaqiyatdan keyin `keyId` ni sessiyada saqlab qo'ysangiz, keyingi imzolar parolsiz o'tadi (6 soat eslab qolish yoqilgan bo'lsa).

## Backend tomoni
Bu qo'llanma frontend haqida. Backend tekshiruvi (PKCS7 verify, sertifikat zanjiri, TSA) uchun: [qo0p/e-imzo-doc](https://github.com/qo0p/e-imzo-doc) (ruscha).

<!-- TODO: mobil login (QR + E-IMZO mobil) -->
