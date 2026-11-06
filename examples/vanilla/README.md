# Vanilla TypeScript yadro

`eimzo-client.ts` — tashqi bog'liqliksiz, ~150 qator. Istalgan frameworkga ko'chirib olsa bo'ladi.

```ts
const eimzo = createEimzoClient({ apiKeys: { localhost: '...', '127.0.0.1': '...' } });
await eimzo.prepare();
const keys = await eimzo.listKeys();
const keyId = await eimzo.openKey(keys[0]);
const pkcs7 = await eimzo.sign(keyId, 'salom');
```

TODO: `keyFromDescription` uchun testlar.

## Demo ishga tushirish
```bash
npx vite examples/vanilla
```
`http://localhost:5173` ochiladi. E-IMZO ishlab turishi kerak. Demo `localhost` va `127.0.0.1` uchun rasmiy e'lon qilingan kalitlarni ishlatadi.

**Sinaldi:** E-IMZO 5.0, macOS, 2026-11-06 — kalitlar ro'yxati, imzo, keshdagi keyId bilan ikkinchi imzo (54 ms, parolsiz), bekor qilingan parol xatosi.
