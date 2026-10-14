import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chevronDown,
  chevronForward,
  gridOutline,
  play,
  gitNetworkOutline,
  lockClosedOutline,
  createOutline,
  locationOutline,
  peopleOutline,
  star,
  timeOutline,
  trashOutline,
  trophy,
} from 'ionicons/icons';
import { Match, PoolFixtures, PoolTeam, Tournament } from '../../core/models';
import { confirmAction } from '../../core/confirm';
import { TournamentService, courtName, knockoutRoundName } from '../../core/tournament.service';
import { SettingsService } from '../../core/settings.service';
import { computeStandings } from '../../core/standings';

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
  ],
  templateUrl: './tournament-detail.page.html',
  styleUrl: './tournament-detail.page.scss',
})
export class TournamentDetailPage {
  private readonly service = inject(TournamentService);
  private readonly alerts = inject(AlertController);
  private readonly nav = inject(NavController);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);

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
    addIcons({ trophy, star, createOutline, trashOutline, locationOutline, timeOutline, chevronDown, peopleOutline, gitNetworkOutline, lockClosedOutline, calendarOutline, chevronForward, gridOutline, play });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournament.set(await this.service.get(this.id));
    this.groups.set(await this.service.fixtures(this.id));
    this.knockout.set(await this.service.knockout(this.id));
  }

  // ---------- Round 2: knockout ----------
  readonly groups = signal<PoolFixtures[]>([]);
  readonly knockout = signal<Match[]>([]);
  readonly koStarted = computed(() => this.knockout().length > 0);

  readonly teamCount = computed(() =>
    (this.tournament()?.pools ?? []).reduce((n, p) => n + p.teams.length, 0),
  );

  readonly poolProgress = computed(() => {
    const all = this.groups().flatMap((g) => g.matches);
    const played = all.filter((m) => m.winner).length;
    return { played, total: all.length, pct: all.length ? (played / all.length) * 100 : 0 };
  });

  /** Knockout progress: current round, matches played (byes excluded) and the winner once decided. */
  readonly koProgress = computed(() => {
    const ko = this.knockout().filter((m) => !m.isBye);
    const played = ko.filter((m) => m.winner).length;
    const lastRound = Math.max(0, ...this.knockout().map((m) => m.koRound ?? 0));
    const current = this.knockout().filter((m) => m.koRound === lastRound);
    const final = current.length === 1 ? current[0]! : null;
    const winner = final?.winner ? (final.winner === 1 ? final.team1 : final.team2).name : null;
    // Total includes rounds still to come: a bracket of n first-round slots has n - 1 matches minus byes.
    const firstRound = this.knockout().filter((m) => m.koRound === 1);
    const byes = firstRound.filter((m) => m.isBye).length;
    const total = Math.max(ko.length, firstRound.length * 2 - 1 - byes);
    return {
      played,
      total,
      pct: total ? (played / total) * 100 : 0,
      roundName: knockoutRoundName(current.length),
      winner,
    };
  });

  private readonly qualifyCount = computed(
    () => this.tournament()?.qualifyCount ?? this.settings.settings().qualifyPerPool,
  );
  private readonly standings = computed(() =>
    this.groups().map((g) => computeStandings(g, this.qualifyCount())),
  );

  /** Pools are cleared when every pool match has a result and no qualifying place is still tied. */
  readonly poolsCleared = computed(() => {
    const tables = this.standings();
    return tables.length > 0 && tables.every((t) => t.complete && !t.tieUnresolved);
  });

  /** Why Round 2 is still locked, shown under the disabled button. */
  readonly lockReason = computed(() => {
    const tables = this.standings();
    const left = this.groups().reduce((n, g) => n + g.matches.filter((m) => !m.winner).length, 0);
    if (left) return `Unlocks when all pool matches are played (${left} left).`;
    if (tables.some((t) => t.tieUnresolved)) return 'Unlocks when the tie for a qualifying place is settled by run rate.';
    return '';
  });

  /** Qualified teams in seed order: every pool winner, then every runner-up, and so on. */
  readonly seeds = computed(() => {
    const tables = this.standings();
    const n = this.qualifyCount();
    const seeds: PoolTeam[] = [];
    for (let rank = 0; rank < n; rank++) {
      for (const t of tables) {
        const row = t.rows[rank];
        if (row) seeds.push(row.team);
      }
    }
    return seeds;
  });

  async startKnockout(): Promise<void> {
    if (!this.poolsCleared()) return;
    const seeds = this.seeds();
    const ok = await confirmAction(
      this.alerts,
      'Start Round 2 · Knockout?',
      `${seeds.length} qualified teams go into the knockout. Pool results can still be viewed but the bracket is drawn now.`,
      'Start knockout',
    );
    if (!ok) return;
    await this.service.startKnockout(this.id, seeds);
    await this.router.navigate(['/tournaments', this.id, 'knockout']);
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
