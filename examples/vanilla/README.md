# Vanilla TypeScript yadro

`eimzo-client.ts` — tashqi bog'liqliksiz, ~150 qator. Istalgan frameworkga ko'chirib olsa bo'ladi.

```ts
const eimzo = createEimzoClient({ apiKeys: { localhost: '...', '127.0.0.1': '...' } });
await eimzo.prepare();
const keys = await eimzo.listKeys();
const keyId = await eimzo.openKey(keys[0]);
const pkcs7 = await eimzo.sign(keyId, 'salom');
```

TODO: `index.html` bilan ishlaydigan demo, `keyFromDescription` uchun testlar.
