import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EimzoService } from './eimzo.service';
import { EimzoKeyPickerComponent } from './eimzo-key-picker.component';
import { EimzoError, type EimzoKey } from '../vanilla/eimzo-client';

@Component({
  selector: 'sign-demo',
  standalone: true,
  imports: [FormsModule, EimzoKeyPickerComponent],
  template: `
    @switch (eimzo.status()) {
      @case ('checking') { <p>E-IMZO tekshirilmoqda…</p> }
      @case ('unavailable') {
        <p>E-IMZO topilmadi. <a href="https://e-imzo.uz" target="_blank" rel="noreferrer">O'rnating</a> yoki ishga tushiring,
          keyin <button (click)="eimzo.refresh()">qayta tekshiring</button>.</p>
      }
      @case ('outdated') { <p>E-IMZO versiyasi eskirgan, yangilang. <button (click)="eimzo.refresh()">Qayta tekshirish</button></p> }
      @case ('error') { <p>E-IMZO rad etdi: {{ eimzo.error() }} <button (click)="eimzo.refresh()">Qayta</button></p> }
      @case ('ready') {
        <div style="max-width: 560px">
          <p style="color: #6b7280">E-IMZO {{ eimzo.versionText() }} · {{ eimzo.keys().length }} ta kalit</p>
          <eimzo-key-picker [keys]="eimzo.keys()" [selectedId]="selected()?.id ?? null" (select)="selected.set($event)" />
          <textarea [(ngModel)]="text" rows="3" style="width: 100%; margin-top: 12px"></textarea>
          <button [disabled]="!selected() || busy()" style="margin-top: 8px" (click)="onSign()">{{ busy() ? 'Imzolanmoqda…' : 'Imzolash' }}</button>
          @if (signError()) { <p style="color: #dc2626">{{ signError() }}</p> }
          @if (pkcs7()) {
            <details open style="margin-top: 12px">
              <summary>PKCS7 (base64, {{ pkcs7().length }} belgi)</summary>
              <pre style="white-space: pre-wrap; word-break: break-all; font-size: 11px">{{ pkcs7() }}</pre>
            </details>
          }
        </div>
      }
    }
  `,
})
export class SignDemoComponent implements OnInit {
  readonly eimzo = inject(EimzoService);
  readonly selected = signal<EimzoKey | null>(null);
  readonly pkcs7 = signal('');
  readonly signError = signal('');
  readonly busy = signal(false);
  text = 'Salom, E-IMZO!';

  ngOnInit(): void { void this.eimzo.refresh(); }

  async onSign(): Promise<void> {
    const key = this.selected();
    if (!key) return;
    this.busy.set(true); this.signError.set(''); this.pkcs7.set('');
    try {
      this.pkcs7.set(await this.eimzo.sign(key, this.text));
    } catch (e) {
      this.signError.set(e instanceof EimzoError && e.kind === 'undastur'
        ? 'E-IMZO javob bermayapti. Dastur ochiqligini tekshiring.'
        : 'Imzolab bo‘lmadi. Parolni tekshirib, qayta urinib ko‘ring.');
    } finally {
      this.busy.set(false);
    }
  }
}
