/**
 * Vue 3 composable: E-IMZO holati, kalitlar va imzolash.
 * Vanilla yadro ustida — UI kutubxonasiga bog'liq emas.
 */
import { ref, onMounted } from 'vue';
import { createEimzoClient, EimzoError, type EimzoKey, type EimzoClientOptions } from '../vanilla/eimzo-client';

export type EimzoStatus = 'checking' | 'ready' | 'unavailable' | 'outdated' | 'error';

export function useEimzo(options: EimzoClientOptions) {
  const client = createEimzoClient(options);
  // keyId keshi (e-imzo-doc §1.3: har load_key yangi keyId beradi, parol yana so'raladi)
  const keyIds = new Map<string, string>();

  const status = ref<EimzoStatus>('checking');
  const version = ref<number | null>(null);
  const keys = ref<EimzoKey[]>([]);
  const error = ref<string | null>(null);

  async function refresh() {
    status.value = 'checking';
    error.value = null;
    keyIds.clear();
    try {
      version.value = await client.prepare();
      keys.value = await client.listKeys();
      status.value = 'ready';
    } catch (e) {
      const err = e instanceof EimzoError ? e : new EimzoError('rad', String(e));
      error.value = err.message;
      status.value = err.kind === 'undastur' ? 'unavailable' : /versiya/i.test(err.message) ? 'outdated' : 'error';
    }
  }

  async function sign(key: EimzoKey, text: string): Promise<string> {
    const cached = keyIds.get(key.id);
    if (cached) {
      try { return await client.sign(cached, text); }
      catch { keyIds.delete(key.id); }
    }
    const keyId = await client.openKey(key);
    keyIds.set(key.id, keyId);
    return client.sign(keyId, text);
  }

  onMounted(refresh);

  return { status, version, keys, error, refresh, sign };
}
