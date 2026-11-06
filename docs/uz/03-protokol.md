# 3. Protokol: xabarlar lug'ati

Barcha xabarlar JSON. `plugin` maydoni qaysi modulga, `name` qaysi amalga. Javobda doim `success`, xato bo'lsa `reason`.

| Plugin | name | arguments | Javob | Izoh |
|--------|------|-----------|-------|------|
| — | `version` | — | `major`, `minor` | birinchi so'rov |
| — | `apikey` | `[domen, kalit, ...]` | — | versiyadan keyin |
| `pfx` | `list_all_certificates` | — | `certificates[]: {disk, path, name, alias}` | PFX fayllar; `alias` — X.500 satr |
| `pfx` | `load_key` | `[disk, path, name, alias]` | `keyId` | kalitni ochish |
| `pfx` | `verify_password` | `[keyId]` | — | parolni alohida tekshirish (6 soat eslab qolish taklif qilmaydi) |
| `ftjc` | `list_all_keys` | `['']` | `tokens[]: {cardUID, info}` | USB tokenlar; token yo'q bo'lsa rad etadi |
| `ftjc` | `load_key` | `[cardUID]` | `keyId` | |
| `ftjc` | `verify_pin` | `[keyId, '1']` | — | PIN tekshirish |
| `pkcs7` | `create_pkcs7` | `[base64, keyId yoki qurilma nomi, 'no'/'yes']` | `pkcs7_64` | uchinchi arg: `'no'` = attached, `'yes'` = detached |
| `idcard` | `list_readers` | — | `readers[]` | ≥ 4.12 |
| `baikey` | `list_tokens` | — | `tokens[]` | ≥ 4.86 |
| `ckc` | `list_ckc` | — | `devices[]` | ≥ 4.86 |

<!-- TODO: timestamp (`get_timestamp_token`), `pkcs7_info`, `attach_timestamp_token` kabi qo'shimcha xabarlar -->
<!-- TODO: har bir qatorga qaysi versiyada tekshirilgani -->
