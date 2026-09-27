import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, trophy } from 'ionicons/icons';
import { Match, MatchWinner, PoolFixtures, Tournament } from '../../core/models';
import { TournamentService, courtName } from '../../core/tournament.service';
import { addMinutes, formatDuration } from '../../core/time.util';

type Filter = 'all' | 'pending' | 'played';

@Component({
  selector: 'app-fixtures',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonBadge,
    IonIcon,
    IonSegment,
    IonSegmentButton,
  ],
  templateUrl: './fixtures.page.html',
  styleUrl: './fixtures.page.scss',
})
export class FixturesPage {
  private readonly service = inject(TournamentService);
  private readonly sheets = inject(ActionSheetController);

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly tournament = signal<Tournament | null>(null);
  readonly groups = signal<PoolFixtures[]>([]);
  readonly loaded = signal(false);
  filter: Filter = 'all';
  readonly filterSig = signal<Filter>('all');

  readonly visible = computed(() => {
    const f = this.filterSig();
    return this.groups().map((g) => ({
      ...g,
      matches: g.matches.filter((m) => f === 'all' || (f === 'played' ? m.winner : !m.winner)),
    }));
  });
  readonly progress = computed(() => {
    const all = this.groups().flatMap((g) => g.matches);
    return { played: all.filter((m) => m.winner).length, total: all.length };
  });

  readonly courtName = courtName;
  readonly formatDuration = formatDuration;

  /** Time slot for a match: pool start + (match number × match length). */
  slot(group: PoolFixtures, match: Match): { from: string; to: string; overBooking: boolean } | null {
    const minutes = this.tournament()?.matchMinutes;
    const start = group.pool.startTime;
    if (!minutes || !start) return null;
    const offset = match.position * minutes;
    const booking = group.pool.bookingMinutes;
    return {
      from: addMinutes(start, offset),
      to: addMinutes(start, offset + minutes),
      overBooking: !!booking && offset + minutes > booking,
    };
  }

  bookingEnd(group: PoolFixtures): string | null {
    const { startTime, bookingMinutes } = group.pool;
    return startTime && bookingMinutes ? addMinutes(startTime, bookingMinutes) : null;
  }

  constructor() {
    addIcons({ trophy, timeOutline, locationOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournament.set(await this.service.get(this.id));
    await this.reload();
    this.loaded.set(true);
  }

  private async reload(): Promise<void> {
    this.groups.set(await this.service.fixtures(this.id));
  }

  setFilter(f: Filter): void {
    this.filter = f;
    this.filterSig.set(f);
  }

  /** Pool standings: wins per team, most wins first. */
  wins(group: PoolFixtures): { name: string; played: number; won: number }[] {
    return group.pool.teams
      .map((t) => {
        const games = group.matches.filter((m) => m.winner && (m.team1.name === t.name || m.team2.name === t.name));
        const won = games.filter((m) => (m.winner === 1 ? m.team1 : m.team2).name === t.name).length;
        return { name: t.name, played: games.length, won };
      })
      .sort((a, b) => b.won - a.won || a.name.localeCompare(b.name));
  }

  async pickWinner(match: Match): Promise<void> {
    const choose = (winner: MatchWinner) => async () => {
      await this.service.setWinner(match.id!, winner);
      await this.reload();
    };
    const sheet = await this.sheets.create({
      header: `${match.team1.name} vs ${match.team2.name}`,
      subHeader: 'Who won this match?',
      buttons: [
        { text: `🏆 ${match.team1.name}`, handler: choose(1) },
        { text: `🏆 ${match.team2.name}`, handler: choose(2) },
        ...(match.winner ? [{ text: 'Clear result', role: 'destructive', handler: choose(null) }] : []),
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
  }
}
