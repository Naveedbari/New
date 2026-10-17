import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular';
import { DatabaseService } from './core/database.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
})
export class App {
  private readonly toasts = inject(ToastController);

  constructor() {
    if (inject(DatabaseService).temporary()) void this.warnTemporary();
  }

  /** Browser storage is blocked, so nothing entered here will be kept after a reload. */
  private async warnTemporary(): Promise<void> {
    const toast = await this.toasts.create({
      message: 'This browser is blocking storage, so the app is running in test mode: nothing is saved after you reload. Open the link in Chrome (not a private window) to keep your data.',
      position: 'top',
      color: 'warning',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await toast.present();
  }
}
