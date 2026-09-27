# Overlays — Ionic Angular v8 (standalone)

Overlays: `ion-alert`, `ion-action-sheet`, `ion-toast`, `ion-loading`, `ion-modal`, `ion-popover`, `ion-picker`. Two ways to present each — controller (DI) or inline component.

## A) Controller (DI) — present programmatically

Import the controller from `@ionic/angular/standalone`, inject via constructor, `await create(...)` then `present()`. You do NOT add the controller to `imports: []` (it is a provider, not a component).

```ts
import { Component } from '@angular/core';
import { IonButton, AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  imports: [IonButton], // only the trigger component
})
export class ExampleComponent {
  constructor(private alertController: AlertController) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'A Short Title Is Best',
      message: 'A message should be a short, complete sentence.',
      buttons: ['Action'],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss(); // optional result
  }
}
```

Controllers: `AlertController`, `ActionSheetController`, `ToastController`, `LoadingController`, `ModalController`, `PopoverController`, `PickerController`. Plus `MenuController` (open/close/toggle `ion-menu`).

### ModalController with a component

```ts
const modal = await this.modalController.create({
  component: MyModalComponent,        // a standalone component
  componentProps: { firstName: 'Nelson' },
  breakpoints: [0, 0.5, 1],
  initialBreakpoint: 0.5,
});
await modal.present();
const { data, role } = await modal.onWillDismiss();
```

Inside the modal component, dismiss with the injected `ModalController`:
`this.modalController.dismiss(payload, 'confirm')`.

## B) Inline — declarative in the template

Add the component to `imports: []` and control it with `isOpen` or a `trigger`. Read the component's reference file for exact props.

```ts
import { IonAlert, IonButton } from '@ionic/angular/standalone';
// imports: [IonAlert, IonButton]
export class ExampleComponent {
  isAlertOpen = false;
  alertButtons = ['Action'];
  setOpen(open: boolean) { this.isAlertOpen = open; }
}
```

```html
<ion-button (click)="setOpen(true)">Open</ion-button>
<ion-alert
  [isOpen]="isAlertOpen"
  header="A Short Title Is Best"
  [buttons]="alertButtons"
  (didDismiss)="setOpen(false)"
></ion-alert>
```

## Choosing

- One-off, imperative flow (confirm dialogs, loading spinners, toasts) → **controller**.
- Overlay tied to template state / reused declaratively → **inline**.

Always confirm option/prop names (`buttons`, `inputs`, `breakpoints`, etc.) against the component's `references/components/<slug>.md`.
