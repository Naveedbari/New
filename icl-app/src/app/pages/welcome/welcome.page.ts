import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { keypadOutline, personOutline, trophy } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';

export const PIN_PATTERN = /^\d{4,6}$/;

const pinsMatch = (group: AbstractControl): ValidationErrors | null =>
  group.get('pin')?.value === group.get('confirmPin')?.value ? null : { pinMismatch: true };

@Component({
  selector: 'app-welcome',
  imports: [ReactiveFormsModule, IonContent, IonList, IonItem, IonInput, IonButton, IonIcon, IonNote, IonText],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss',
})
export class WelcomePage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      pin: ['', [Validators.required, Validators.pattern(PIN_PATTERN)]],
      confirmPin: ['', [Validators.required]],
    },
    { validators: pinsMatch },
  );

  constructor() {
    addIcons({ trophy, personOutline, keypadOutline });
  }

  async create(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const { username, pin } = this.form.getRawValue();
      await this.auth.register(username, pin);
      this.form.reset();
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Could not create account');
    } finally {
      this.saving.set(false);
    }
  }
}
