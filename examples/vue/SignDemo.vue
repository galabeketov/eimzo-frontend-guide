<script setup lang="ts">
import { ref } from 'vue';
import { useEimzo } from './useEimzo';
import EimzoKeyPicker from './EimzoKeyPicker.vue';
import { EimzoError, type EimzoKey } from '../vanilla/eimzo-client';

const { status, version, keys, error, refresh, sign } = useEimzo({
  apiKeys: {
    localhost: '<rasmiy qo‘llanmadagi localhost kaliti>',
    '127.0.0.1': '<rasmiy qo‘llanmadagi 127.0.0.1 kaliti>',
  },
});

const selected = ref<EimzoKey | null>(null);
const text = ref('Salom, E-IMZO!');
const pkcs7 = ref('');
const signError = ref('');
const busy = ref(false);

async function onSign() {
  if (!selected.value) return;
  busy.value = true; signError.value = ''; pkcs7.value = '';
  try {
    pkcs7.value = await sign(selected.value, text.value);
  } catch (e) {
    signError.value = e instanceof EimzoError && e.kind === 'undastur'
      ? 'E-IMZO javob bermayapti. Dastur ochiqligini tekshiring.'
      : 'Imzolab bo‘lmadi. Parolni tekshirib, qayta urinib ko‘ring.';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <p v-if="status === 'checking'">E-IMZO tekshirilmoqda…</p>
  <p v-else-if="status === 'unavailable'">
    E-IMZO topilmadi. <a href="https://e-imzo.uz" target="_blank" rel="noreferrer">O'rnating</a> yoki ishga tushiring,
    keyin <button @click="refresh">qayta tekshiring</button>.
  </p>
  <p v-else-if="status === 'outdated'">E-IMZO versiyasi eskirgan, yangilang. <button @click="refresh">Qayta tekshirish</button></p>
  <p v-else-if="status === 'error'">E-IMZO rad etdi: {{ error }} <button @click="refresh">Qayta</button></p>
  <div v-else style="max-width: 560px">
    <p style="color: #6b7280">E-IMZO {{ Math.floor((version ?? 0) / 100) }}.{{ (version ?? 0) % 100 }} · {{ keys.length }} ta kalit</p>
    <EimzoKeyPicker :keys="keys" :selected-id="selected?.id ?? null" @select="selected = $event" />
    <textarea v-model="text" rows="3" style="width: 100%; margin-top: 12px" />
    <button :disabled="!selected || busy" style="margin-top: 8px" @click="onSign">{{ busy ? 'Imzolanmoqda…' : 'Imzolash' }}</button>
    <p v-if="signError" style="color: #dc2626">{{ signError }}</p>
    <details v-if="pkcs7" open style="margin-top: 12px">
      <summary>PKCS7 (base64, {{ pkcs7.length }} belgi)</summary>
      <pre style="white-space: pre-wrap; word-break: break-all; font-size: 11px">{{ pkcs7 }}</pre>
    </details>
  </div>
</template>
