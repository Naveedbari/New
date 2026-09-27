import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, flag, logOutOutline, medal, ribbonOutline, star, trophy } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { Tournament } from '../../core/models';
import { TournamentService } from '../../core/tournament.service';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly tournaments = inject(TournamentService);
  readonly auth = inject(AuthService);

  readonly all = signal<Tournament[]>([]);
  readonly loaded = signal(false);
  /** Most recent tournament (list is ordered by date, newest first). */
  readonly latest = computed(() => this.all()[0] ?? null);
  readonly history = computed(() => this.all().slice(1));

  constructor() {
    addIcons({ trophy, flag, medal, star, calendarOutline, logOutOutline, ribbonOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.all.set(await this.tournaments.list('completed'));
    this.loaded.set(true);
  }

  /** Parses YYYY-MM-DD as a local date so the day never shifts across time zones. */
  asDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d ?? 1);
  }

  initial(name: string | null): string {
    return (name ?? '').trim().charAt(0).toUpperCase();
  }
}
