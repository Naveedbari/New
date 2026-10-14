import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronDown,
  createOutline,
  listOutline,
  locationOutline,
  peopleOutline,
  star,
  timeOutline,
  trashOutline,
  trophy,
} from 'ionicons/icons';
import { Tournament } from '../../core/models';
import { confirmAction } from '../../core/confirm';
import { TournamentService, courtName } from '../../core/tournament.service';

@Component({
  selector: 'app-tournament-detail',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonBadge,
  ],
  templateUrl: './tournament-detail.page.html',
  styleUrls: ['../tournament-new/tournament-new.page.scss', './tournament-detail.page.scss'],
})
export class TournamentDetailPage {
  private readonly service = inject(TournamentService);
  private readonly alerts = inject(AlertController);
  private readonly nav = inject(NavController);

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly tournament = signal<Tournament | null>(null);
  /** Pools whose team list is expanded; all start collapsed. */
  readonly openPools = signal<Set<number>>(new Set());

  isOpen(poolId: number): boolean {
    return this.openPools().has(poolId);
  }

  toggle(poolId: number): void {
    const next = new Set(this.openPools());
    next.has(poolId) ? next.delete(poolId) : next.add(poolId);
    this.openPools.set(next);
  }
  readonly courtName = courtName;

  constructor() {
    addIcons({ trophy, star, createOutline, trashOutline, locationOutline, listOutline, timeOutline, chevronDown, peopleOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournament.set(await this.service.get(this.id));
  }

  asDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d ?? 1);
  }

  async confirmDelete(): Promise<void> {
    const t = this.tournament();
    if (!t) return;
    if (await confirmAction(this.alerts, 'Delete tournament?', `"${t.name}" with its pools and matches will be removed permanently.`, 'Delete')) {
      await this.service.remove(this.id);
      await this.nav.navigateBack('/tabs/tournaments');
    }
  }
}
