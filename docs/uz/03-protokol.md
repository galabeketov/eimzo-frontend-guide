# 3. Protokol: xabarlar lug'ati

Barcha xabarlar JSON. `plugin` — qaysi modul, `name` — qaysi amal, `arguments` — massiv. Javobda doim `success`, xato bo'lsa `reason`.

## Umumiy
| name | arguments | Javob | Izoh |
|------|-----------|-------|------|
| `version` | — | `major`, `minor` (matn) | birinchi so'rov |
| `apikey` | `[domen, kalit, domen, kalit, ...]` | — | versiyadan keyin, boshqa hammasidan oldin |

## Kalitlar: `pfx` (fayl), `ftjc` (USB token), `certkey` (eski ombor)
| plugin | name | arguments | Javob | Izoh |
|--------|------|-----------|-------|------|
| `pfx` | `list_all_certificates` | — | `certificates[]: {disk, path, name, alias}` | `alias` — X.500 satr |
| `pfx` | `load_key` | `[disk, path, name, alias]` | `keyId` | |
| `pfx` | `verify_password` | `[keyId]` | — | parolni alohida tekshirish; "6 soat eslab qolish" taklif qilmaydi |
| `pfx` | `change_password` | `[keyId]` | — | E-IMZO oynasida parol almashtirish |
| `ftjc` | `list_all_keys` | `['']` | `tokens[]: {cardUID, info}` | token yo'q bo'lsa rad etadi |
| `ftjc` | `load_key` | `[cardUID]` | `keyId` | |
| `ftjc` | `verify_pin` | `[keyId, '1']` | — | |
| `ftjc` | `change_pin` | `[keyId, '1']` | — | |
| `certkey` | `list_all_certificates` | — | `certificates[]` | eski loyihalarda uchraydi, `serialNumber` bilan `load_key` |

## Imzo: `pkcs7`
| name | arguments | Javob | Izoh |
|------|-----------|-------|------|
| `create_pkcs7` | `[base64, keyId yoki qurilma, 'no'/'yes']` | `pkcs7_64`, `signer_serial_number`, `signature_hex` | `'no'` = attached, `'yes'` = detached |
| `append_pkcs7_attached` | `[pkcs7_64, keyId]` | `pkcs7_64`, `signer_serial_number`, `signature_hex` | mavjud imzoga **ikkinchi imzo** qo'shish (qarshi tomon tasdiqlashi) |
| `attach_timestamp_token_pkcs7` | `[pkcs7_64, signer_serial_number, tst]` | `pkcs7_64` | TSA dan kelgan vaqt tamg'asini imzoga biriktirish |
| `pkcs7_info` | `[pkcs7_64]` | sertifikat ma'lumotlari | imzodan JShShIR/STIR o'qish (ID-karta loginida kerak) <!-- TODO: aniq javob shakli --> |

## Qurilmalar
| plugin | name | Javob | Min. versiya |
|--------|------|-------|--------------|
| `idcard` | `list_readers` | `readers[]` | 4.12 |
| `baikey` | `list_tokens` / `list_all_certificates` | `tokens[]` / `certificates[]` | 4.86 |
| `ckc` | `list_ckc` | `devices[]` | 4.86 |

Qurilma bilan imzolashda `create_pkcs7` ning ikkinchi argumenti `keyId` o'rniga `'idcard'`, `'baikey'` yoki `'ckc'` satri bo'ladi.

<!-- TODO: get_timestamp_token kabi boshqa xabarlar; har bir qator qaysi versiyada tekshirilgani -->
