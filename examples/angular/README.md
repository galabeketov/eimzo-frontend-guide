# Angular misoli

Vanilla yadro (`../vanilla/eimzo-client.ts`) ustida. Angular 17+ (standalone, signals, `@if/@for` sintaksisi). npm'da Angular uchun E-IMZO paketi yo'q — bu birinchi ochiq namuna.

| Fayl | Nima |
|------|------|
| `eimzo.service.ts` | `providedIn: 'root'` servis: `status`, `version`, `keys`, `error` signallari, `refresh()`, `sign(key, text)`. keyId keshlanadi. |
| `eimzo-key-picker.component.ts` | Kalit ro'yxati: muddati tugaganlar oxirida va o'chirilgan, 30 kun qolganlar sariq. |
| `sign-demo.component.ts` | To'liq oqim: holat → kalit → matn → PKCS7. |

## Ulash
```bash
cp -r examples/vanilla examples/angular src/app/eimzo/
```
```ts
// app.component.ts
import { SignDemoComponent } from './eimzo/angular/sign-demo.component';
@Component({ standalone: true, imports: [SignDemoComponent], template: '<sign-demo />' })
export class AppComponent {}
```
`eimzo.service.ts` ichidagi `EIMZO_OPTIONS.apiKeys` ga o'z domeningiz kalitini qo'shing. Muhitga qarab berish kerak bo'lsa, `InjectionToken` qiling.

## Eski Angular (≤16)
`input()/output()` o'rniga `@Input()/@Output()`, `@if/@for` o'rniga `*ngIf/*ngFor`, signallar o'rniga `BehaviorSubject`. Mantiq o'zgarmaydi.

## Zone va `async`
Vanilla klient `Promise` qaytaradi, Angular zone ichida ishlaydi, qo'shimcha `ChangeDetectorRef` kerak emas. Zoneless rejimda signallar baribir yangilanadi.
