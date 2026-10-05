import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ActionSheetController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  locationOutline,
  ribbonOutline,
  timeOutline,
  trophy,
  trophyOutline,
} from 'ionicons/icons';
import { Match, MatchWinner, PoolFixtures, PoolTeam, TossDecision, Tournament } from '../../core/models';
import { TournamentService, courtName } from '../../core/tournament.service';
import { addMinutes, formatDuration } from '../../core/time.util';

type Filter = 'all' | 'pending' | 'played';
type ResultsView = 'matches' | 'table';

/** Points awarded for a win; a loss scores nothing (no draws without scores). */
export const POINTS_PER_WIN = 2;

export interface StandingRow {
  team: PoolTeam;
  played: number;
  won: number;
  lost: number;
  remaining: number;
  points: number;
}

@Component({
  selector: 'app-fixtures',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    IonLabel,
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
  readonly filter = signal<Filter>('all');
  /** Inside the Results tab: the finished match cards, or the points table. */
  readonly resultsView = signal<ResultsView>('matches');
  readonly showTable = computed(() => this.filter() === 'played' && this.resultsView() === 'table');
  readonly pointsPerWin = POINTS_PER_WIN;

  readonly visible = computed(() => {
    const f = this.filter();
    return this.groups().map((g) => ({
      ...g,
      matches: g.matches.filter((m) => f === 'all' || (f === 'played' ? m.winner : !m.winner)),
    }));
  });
  readonly progress = computed(() => {
    const all = this.groups().flatMap((g) => g.matches);
    return { played: all.filter((m) => m.winner).length, total: all.length };
  });
  /** Tournament date as a local Date for the date pipe. */
  readonly matchDate = computed(() => {
    const iso = this.tournament()?.playedOn;
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d ?? 1);
  });

  readonly courtName = courtName;
  readonly formatDuration = formatDuration;

  constructor() {
    addIcons({ trophy, trophyOutline, timeOutline, locationOutline, calendarOutline, ribbonOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournament.set(await this.service.get(this.id));
    await this.reload();
    this.loaded.set(true);
  }

  private async reload(): Promise<void> {
    this.groups.set(await this.service.fixtures(this.id));
  }

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

  team(match: Match, side: 1 | 2): PoolTeam {
    return side === 1 ? match.team1 : match.team2;
  }

  initial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  /**
   * Points table for one pool: most points first, then fewer games played
   * (a team with games in hand ranks higher), then name.
   */
  standings(group: PoolFixtures): StandingRow[] {
    const same = (a: PoolTeam, b: PoolTeam) =>
      a.teamId != null && b.teamId != null ? a.teamId === b.teamId : a.name === b.name;
    return group.pool.teams
      .map((team) => {
        const games = group.matches.filter((m) => same(m.team1, team) || same(m.team2, team));
        const played = games.filter((m) => m.winner);
        const won = played.filter((m) => same(m.winner === 1 ? m.team1 : m.team2, team)).length;
        return {
          team,
          played: played.length,
          won,
          lost: played.length - won,
          remaining: games.length - played.length,
          points: won * POINTS_PER_WIN,
        };
      })
      .sort((a, b) => b.points - a.points || a.played - b.played || a.team.name.localeCompare(b.team.name));
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

  async setDecision(match: Match, decision: TossDecision): Promise<void> {
    await this.service.setTossDecision(match.id!, match.toss?.decision === decision ? null : decision);
    await this.reload();
  }

  async pickWinner(match: Match): Promise<void> {
    const sheet = await this.sheets.create({
      header: `${match.team1.name} vs ${match.team2.name}`,
      subHeader: 'Who won this match?',
      buttons: [
        { text: match.team1.name, data: 1 },
        { text: match.team2.name, data: 2 },
        ...(match.winner ? [{ text: 'Clear result', role: 'destructive', data: null }] : []),
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
    const { data, role } = await sheet.onDidDismiss<MatchWinner>();
    if (role === 'cancel' || role === 'backdrop' || data === undefined) return;
    await this.service.setWinner(match.id!, data);
    await this.reload();
  }
}
