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
  AlertController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline, cloudUploadOutline, downloadOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { BackupService } from '../../core/backup.service';
import { confirmAction } from '../../core/confirm';
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
  private readonly backup = inject(BackupService);
  private readonly alerts = inject(AlertController);
  readonly busy = signal(false);

  readonly matchMinutes = signal<number | null>(null);
  readonly overs = signal<number | null>(null);
  readonly bookingHours = signal<number | null>(null);
  readonly qualify = signal<number | null>(null);
  readonly saving = signal(false);

  readonly error = computed(() => {
    const minutes = this.matchMinutes();
    const overs = this.overs();
    const hours = this.bookingHours();
    const q = this.qualify();
    if (!minutes || !Number.isInteger(minutes) || minutes < 5 || minutes > 600) {
      return 'Match duration must be a whole number between 5 and 600 minutes.';
    }
    if (!overs || !Number.isInteger(overs) || overs < 1 || overs > 50) {
      return 'Overs per match must be a whole number between 1 and 50.';
    }
    if (!hours || hours <= 0 || hours > 24 || (hours * 60) % 15 !== 0) {
      return 'Court booking must be between 0.25 and 24 hours, in steps of 15 minutes (e.g. 1.5).';
    }
    if (!q || !Number.isInteger(q) || q < 1 || q > 16) {
      return 'Qualifying teams per pool must be a whole number between 1 and 16.';
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
    addIcons({ logOutOutline, cloudDownloadOutline, cloudUploadOutline, downloadOutline });
  }

  async exportBackup(): Promise<void> {
    this.busy.set(true);
    try {
      const where = await this.backup.export();
      await this.toast(where ? `Backup saved to ${where}` : 'Backup ready to share', 'success');
    } catch {
      await this.toast('Could not save the backup', 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  async restoreBackup(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const { backup, summary } = await this.backup.read(file);
      const date = new Date(summary.createdAt).toLocaleString();
      const ok = await confirmAction(
        this.alerts,
        'Restore backup?',
        `Backup from ${date}: ${summary.teams} teams and ${summary.tournaments} tournaments. ` +
          'This replaces ALL data currently in the app.',
        'Restore',
      );
      if (!ok) return;
      this.busy.set(true);
      await this.backup.restore(backup);
      this.ionViewWillEnter();
      await this.toast('Backup restored', 'success');
    } catch (e) {
      await this.toast((e as Error)?.message || 'Could not restore the backup', 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  ionViewWillEnter(): void {
    const s = this.service.settings();
    this.matchMinutes.set(s.matchMinutes);
    this.overs.set(s.oversPerMatch);
    this.bookingHours.set(s.bookingMinutes / 60);
    this.qualify.set(s.qualifyPerPool);
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
        qualifyPerPool: this.qualify()!,
      });
      const t = await this.toasts.create({ message: 'Settings saved', color: 'success', duration: 1500 });
      await t.present();
    } finally {
      this.saving.set(false);
    }
  }

  private async toast(message: string, color: 'success' | 'danger'): Promise<void> {
    const t = await this.toasts.create({ message, color, duration: 2500 });
    await t.present();
  }
}
