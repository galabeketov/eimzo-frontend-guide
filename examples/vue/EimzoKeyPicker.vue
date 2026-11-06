<script setup lang="ts">
import { computed } from 'vue';
import type { EimzoKey } from '../vanilla/eimzo-client';

const props = defineProps<{ keys: readonly EimzoKey[]; selectedId: string | null }>();
const emit = defineEmits<{ select: [key: EimzoKey] }>();

const DAY = 86_400_000;
type Term = 'valid' | 'ending' | 'ended' | 'unknown';
function termOf(key: EimzoKey): Term {
  if (!key.validUntil) return 'unknown';
  const left = key.validUntil.getTime() - Date.now();
  if (left <= 0) return 'ended';
  return left <= 30 * DAY ? 'ending' : 'valid';
}
const ordered = computed(() => [...props.keys].sort((a, b) => Number(termOf(a) === 'ended') - Number(termOf(b) === 'ended')));
const titleOf = (k: EimzoKey) => k.organisation || k.fullName || k.pinfl || k.tin;
</script>

<template>
  <p v-if="keys.length === 0">Kalit topilmadi. PFX faylni diskka joylang yoki tokenni ulang.</p>
  <ul v-else class="eimzo-keys">
    <li v-for="key in ordered" :key="key.id">
      <button
        type="button"
        :disabled="termOf(key) === 'ended'"
        :aria-pressed="selectedId === key.id"
        :class="{ selected: selectedId === key.id, ended: termOf(key) === 'ended' }"
        @click="emit('select', key)"
      >
        <strong>{{ titleOf(key) }}</strong>
        <div class="meta">
          <span v-if="key.pinfl">JShShIR {{ key.pinfl }} · </span>
          <span v-if="key.tin">STIR {{ key.tin }} · </span>
          <span v-if="key.organisation && key.fullName">{{ key.fullName }} · </span>
          <span v-if="key.position">{{ key.position }} · </span>
          <span>{{ key.kind === 'pfx' ? 'fayl' : 'token' }}</span>
        </div>
        <div v-if="key.validUntil" class="term" :class="termOf(key)">
          {{ termOf(key) === 'ended' ? 'Muddati tugagan' : termOf(key) === 'ending' ? 'Muddati tugayapti' : 'Amal qiladi' }}:
          {{ key.validUntil.toLocaleDateString('uz-UZ') }}
        </div>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.eimzo-keys { list-style: none; padding: 0; margin: 0; }
button { display: block; width: 100%; text-align: left; padding: 12px; margin-bottom: 8px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; }
button.selected { border: 2px solid #2563eb; }
button.ended { opacity: .5; cursor: not-allowed; }
.meta { font-size: 13px; color: #4b5563; }
.term { font-size: 12px; color: #6b7280; }
.term.ending { color: #d97706; }
.term.ended { color: #dc2626; }
</style>
