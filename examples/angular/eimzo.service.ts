/**
 * Angular service: E-IMZO holati, kalitlar va imzolash (signals).
 * Vanilla yadro ustida — Angular 17+ standalone.
 */
import { Injectable, signal, computed } from '@angular/core';
import { createEimzoClient, EimzoError, type EimzoKey, type EimzoClientOptions } from '../vanilla/eimzo-client';

export type EimzoStatus = 'idle' | 'checking' | 'ready' | 'unavailable' | 'outdated' | 'error';

/** Domen kalitlari — ilova darajasida bir marta beriladi (app.config.ts). */
export const EIMZO_OPTIONS: EimzoClientOptions = {
  apiKeys: {
    localhost: '<rasmiy qo‘llanmadagi localhost kaliti>',
    '127.0.0.1': '<rasmiy qo‘llanmadagi 127.0.0.1 kaliti>',
  },
};

@Injectable({ providedIn: 'root' })
export class EimzoService {
  private readonly client = createEimzoClient(EIMZO_OPTIONS);
  // keyId keshi (e-imzo-doc §1.3: har load_key yangi keyId, parol yana so'raladi)
  private readonly keyIds = new Map<string, string>();

  readonly status = signal<EimzoStatus>('idle');
  readonly version = signal<number | null>(null);
  readonly keys = signal<EimzoKey[]>([]);
  readonly error = signal<string | null>(null);
  readonly versionText = computed(() => {
    const v = this.version() ?? 0;
    return `${Math.floor(v / 100)}.${v % 100}`;
  });

  async refresh(): Promise<void> {
    this.status.set('checking');
    this.error.set(null);
    this.keyIds.clear();
    try {
      this.version.set(await this.client.prepare());
      this.keys.set(await this.client.listKeys());
      this.status.set('ready');
    } catch (e) {
      const err = e instanceof EimzoError ? e : new EimzoError('rad', String(e));
      this.error.set(err.message);
      this.status.set(err.kind === 'undastur' ? 'unavailable' : /versiya/i.test(err.message) ? 'outdated' : 'error');
    }
  }

  async sign(key: EimzoKey, text: string): Promise<string> {
    const cached = this.keyIds.get(key.id);
    if (cached) {
      try { return await this.client.sign(cached, text); }
      catch { this.keyIds.delete(key.id); }
    }
    const keyId = await this.client.openKey(key);
    this.keyIds.set(key.id, keyId);
    return this.client.sign(keyId, text);
  }
}
