import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, flagOutline, trophy } from 'ionicons/icons';
import { Tournament } from '../../core/models';
import { TournamentService } from '../../core/tournament.service';

@Component({
  selector: 'app-tournaments',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    IonButton,
    IonFab,
    IonFabButton,
  ],
  templateUrl: './tournaments.page.html',
  styleUrl: '../teams/teams.page.scss',
})
export class TournamentsPage {
  private readonly service = inject(TournamentService);
  readonly tournaments = signal<Tournament[]>([]);
  readonly loaded = signal(false);

  constructor() {
    addIcons({ add, trophy, flagOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournaments.set(await this.service.list());
    this.loaded.set(true);
  }

  asDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d ?? 1);
  }
}
