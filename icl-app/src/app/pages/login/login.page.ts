import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { lockClosedOutline, trophy } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, IonContent, IonItem, IonInput, IonButton, IonIcon, IonText],
  templateUrl: './login.page.html',
  styleUrl: '../welcome/welcome.page.scss',
})
export class LoginPage {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly pin = signal('');
  readonly error = signal('');
  readonly busy = signal(false);

  constructor() {
    addIcons({ trophy, lockClosedOutline });
  }

  async login(): Promise<void> {
    const pin = this.pin();
    if (!pin) return;
    this.busy.set(true);
    this.error.set('');
    const ok = await this.auth.login(pin);
    this.busy.set(false);
    this.pin.set('');
    if (ok) {
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } else {
      this.error.set('Incorrect PIN. Please try again.');
    }
  }
}
