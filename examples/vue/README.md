# Vue 3 misoli

Vanilla yadro (`../vanilla/eimzo-client.ts`) ustida. `<script setup>` + TypeScript, UI kutubxonasisiz.

| Fayl | Nima |
|------|------|
| `useEimzo.ts` | Composable: `status`, `version`, `keys`, `error`, `refresh()`, `sign(key, text)`. keyId keshlanadi. |
| `EimzoKeyPicker.vue` | Kalit ro'yxati: muddati tugaganlar oxirida va o'chirilgan, 30 kun qolganlar sariq. |
| `SignDemo.vue` | To'liq oqim: holat → kalit → matn → PKCS7. |

## Ulash
```bash
cp -r examples/vanilla examples/vue src/eimzo/
```
```vue
<script setup lang="ts">
import SignDemo from './eimzo/vue/SignDemo.vue';
</script>
<template><SignDemo /></template>
```
`SignDemo.vue` ichidagi `apiKeys` ga o'z domeningiz kalitini qo'shing.

## Pinia bilan
`useEimzo` ni store ichida chaqirmang — `onMounted` ishlatadi. Store kerak bo'lsa, `createEimzoClient` ni to'g'ridan-to'g'ri store'da ishlating, `keyIds` keshini ham store'da saqlang (sahifa yangilanganda baribir yo'qoladi, bu E-IMZO qoidasi — e-imzo-doc §1.3).

## Vue 2
`vue-eimzo` (Adizbek) rasmiy klient ustida ishlaydi. Bu misol Vue 3 uchun; Vue 2 ga ko'chirish uchun `ref` → `data`, `onMounted` → `mounted`.
