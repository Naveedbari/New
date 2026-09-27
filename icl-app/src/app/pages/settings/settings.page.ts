import { Component, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { SettingsService } from '../../core/settings.service';
import { formatDuration } from '../../core/time.util';

@Component({
  selector: 'app-settings',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonInput,
    IonLabel,
    IonNote,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  private readonly service = inject(SettingsService);
  private readonly toasts = inject(ToastController);
  readonly auth = inject(AuthService);

  readonly matchMinutes = signal<number | null>(null);
  readonly overs = signal<number | null>(null);
  readonly bookingHours = signal<number | null>(null);
  readonly saving = signal(false);

  readonly error = computed(() => {
    const minutes = this.matchMinutes();
    const overs = this.overs();
    const hours = this.bookingHours();
    if (!minutes || !Number.isInteger(minutes) || minutes < 5 || minutes > 600) {
      return 'Match duration must be a whole number between 5 and 600 minutes.';
    }
    if (!overs || !Number.isInteger(overs) || overs < 1 || overs > 50) {
      return 'Overs per match must be a whole number between 1 and 50.';
    }
    if (!hours || hours <= 0 || hours > 24 || (hours * 60) % 15 !== 0) {
      return 'Court booking must be between 0.25 and 24 hours, in steps of 15 minutes (e.g. 1.5).';
    }
    return '';
  });

  /** How many matches fit in one default booking, as a quick sanity check. */
  readonly fitSummary = computed(() => {
    if (this.error()) return '';
    const booking = this.bookingHours()! * 60;
    const fits = Math.floor(booking / this.matchMinutes()!);
    return `A ${formatDuration(booking)} booking fits ${fits} match${fits === 1 ? '' : 'es'} of ${this.matchMinutes()} minutes.`;
  });

  constructor() {
    addIcons({ logOutOutline });
  }

  ionViewWillEnter(): void {
    const s = this.service.settings();
    this.matchMinutes.set(s.matchMinutes);
    this.overs.set(s.oversPerMatch);
    this.bookingHours.set(s.bookingMinutes / 60);
  }

  toNumber(value: string | number | null | undefined): number | null {
    const n = Number(value);
    return value === '' || value == null || Number.isNaN(n) ? null : n;
  }

  async save(): Promise<void> {
    if (this.error()) return;
    this.saving.set(true);
    try {
      await this.service.save({
        matchMinutes: this.matchMinutes()!,
        oversPerMatch: this.overs()!,
        bookingMinutes: Math.round(this.bookingHours()! * 60),
      });
      const t = await this.toasts.create({ message: 'Settings saved', color: 'success', duration: 1500 });
      await t.present();
    } finally {
      this.saving.set(false);
    }
  }
}
