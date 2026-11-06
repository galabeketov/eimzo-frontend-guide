import { Component, input, output } from '@angular/core';
import type { EimzoKey } from '../vanilla/eimzo-client';

type Term = 'valid' | 'ending' | 'ended' | 'unknown';
const DAY = 86_400_000;

@Component({
  selector: 'eimzo-key-picker',
  standalone: true,
  template: `
    @if (keys().length === 0) {
      <p>Kalit topilmadi. PFX faylni diskka joylang yoki tokenni ulang.</p>
    } @else {
      <ul class="eimzo-keys">
        @for (key of ordered(); track key.id) {
          <li>
            <button type="button"
              [disabled]="termOf(key) === 'ended'"
              [attr.aria-pressed]="selectedId() === key.id"
              [class.selected]="selectedId() === key.id"
              [class.ended]="termOf(key) === 'ended'"
              (click)="select.emit(key)">
              <strong>{{ titleOf(key) }}</strong>
              <div class="meta">
                @if (key.pinfl) { <span>JShShIR {{ key.pinfl }} · </span> }
                @if (key.tin) { <span>STIR {{ key.tin }} · </span> }
                @if (key.organisation && key.fullName) { <span>{{ key.fullName }} · </span> }
                @if (key.position) { <span>{{ key.position }} · </span> }
                <span>{{ key.kind === 'pfx' ? 'fayl' : 'token' }}</span>
              </div>
              @if (key.validUntil) {
                <div class="term" [class]="'term ' + termOf(key)">
                  {{ termOf(key) === 'ended' ? 'Muddati tugagan' : termOf(key) === 'ending' ? 'Muddati tugayapti' : 'Amal qiladi' }}:
                  {{ key.validUntil.toLocaleDateString('uz-UZ') }}
                </div>
              }
            </button>
          </li>
        }
      </ul>
    }
  `,
  styles: [`
    .eimzo-keys { list-style: none; padding: 0; margin: 0; }
    button { display: block; width: 100%; text-align: left; padding: 12px; margin-bottom: 8px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer; }
    button.selected { border: 2px solid #2563eb; }
    button.ended { opacity: .5; cursor: not-allowed; }
    .meta { font-size: 13px; color: #4b5563; }
    .term { font-size: 12px; color: #6b7280; }
    .term.ending { color: #d97706; }
    .term.ended { color: #dc2626; }
  `],
})
export class EimzoKeyPickerComponent {
  readonly keys = input.required<EimzoKey[]>();
  readonly selectedId = input<string | null>(null);
  readonly select = output<EimzoKey>();

  ordered(): EimzoKey[] {
    return [...this.keys()].sort((a, b) => Number(this.termOf(a) === 'ended') - Number(this.termOf(b) === 'ended'));
  }
  termOf(key: EimzoKey): Term {
    if (!key.validUntil) return 'unknown';
    const left = key.validUntil.getTime() - Date.now();
    if (left <= 0) return 'ended';
    return left <= 30 * DAY ? 'ending' : 'valid';
  }
  titleOf(key: EimzoKey): string {
    return key.organisation || key.fullName || key.pinfl || key.tin;
  }
}
