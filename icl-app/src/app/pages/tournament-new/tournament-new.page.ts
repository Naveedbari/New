import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline, shuffle as shuffleIcon } from 'ionicons/icons';
import { Pool, Team } from '../../core/models';
import { TeamService } from '../../core/team.service';
import { TournamentService, courtName, drawPools, poolSizes, seasonName } from '../../core/tournament.service';

type Step = 'teams' | 'pools' | 'draw';

const today = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

@Component({
  selector: 'app-tournament-new',
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    IonFooter,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonInput,
    IonNote,
    IonIcon,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
  templateUrl: './tournament-new.page.html',
  styleUrl: './tournament-new.page.scss',
})
export class TournamentNewPage {
  private readonly teamService = inject(TeamService);
  private readonly tournaments = inject(TournamentService);
  private readonly nav = inject(NavController);
  private readonly toasts = inject(ToastController);

  readonly step = signal<Step>('teams');
  readonly saving = signal(false);

  // Step 1 – season + team selection
  readonly season = signal<number | null>(null);
  readonly name = computed(() => (this.season() ? seasonName(this.season()!) : ''));
  playedOn = today();
  readonly allTeams = signal<Team[]>([]);
  readonly filter = signal('');
  readonly selectedIds = signal<Set<number>>(new Set());
  readonly selectedTeams = computed(() => this.allTeams().filter((t) => this.selectedIds().has(t.id!)));
  readonly visibleTeams = computed(() => {
    const q = this.filter().trim().toLowerCase();
    return q
      ? this.allTeams().filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.captainName.toLowerCase().includes(q) ||
            t.captainPhone.includes(q),
        )
      : this.allTeams();
  });

  // Step 2 – pools and courts. Team counts per pool are worked out automatically.
  readonly poolCount = signal<number | null>(null);
  readonly courtCount = signal<number | null>(null);
  readonly sizes = computed(() => {
    const pools = this.poolCount();
    return pools && !this.poolError() ? poolSizes(this.selectedTeams().length, pools) : [];
  });
  readonly sizeSummary = computed(() => {
    const sizes = this.sizes();
    if (!sizes.length) return '';
    const max = sizes[0]!;
    const min = sizes[sizes.length - 1]!;
    if (max === min) return `${sizes.length} pools × ${max} teams each`;
    const big = sizes.filter((n) => n === max).length;
    return `${big} pool(s) of ${max} teams and ${sizes.length - big} pool(s) of ${min} teams`;
  });
  readonly courtSummary = computed(() => {
    const pools = this.poolCount() ?? 0;
    const courts = this.courtCount() ?? 0;
    if (!pools || !courts || this.poolError()) return '';
    if (courts >= pools) return 'Every pool gets its own court.';
    const perCourt = Math.ceil(pools / courts);
    return `Courts will be shared — up to ${perCourt} pools per court.`;
  });
  readonly poolError = computed(() => {
    const pools = this.poolCount();
    const courts = this.courtCount();
    const selected = this.selectedTeams().length;
    if (!pools) return 'Enter the number of pools.';
    if (!Number.isInteger(pools) || pools < 1) return 'Number of pools must be a whole number of 1 or more.';
    if (selected / pools < 2) return `${selected} teams can make at most ${Math.floor(selected / 2)} pools (2+ teams per pool).`;
    if (!courts) return 'Enter the number of courts.';
    if (!Number.isInteger(courts) || courts < 1) return 'Number of courts must be a whole number of 1 or more.';
    return '';
  });

  // Step 3 – draw
  readonly pools = signal<Pool[]>([]);

  constructor() {
    addIcons({ shuffle: shuffleIcon, locationOutline });
    this.teamService.search('').then((teams) => this.allTeams.set(teams));
    this.tournaments.nextSeason().then((n) => this.season.set(n));
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggle(id: number, checked: boolean): void {
    const next = new Set(this.selectedIds());
    checked ? next.add(id) : next.delete(id);
    this.selectedIds.set(next);
  }

  toggleAll(): void {
    const all = this.allTeams();
    this.selectedIds.set(
      this.selectedIds().size === all.length ? new Set() : new Set(all.map((t) => t.id!)),
    );
  }

  async toPools(): Promise<void> {
    const season = this.season();
    if (!season || !Number.isInteger(season) || season < 1) {
      this.toast('Enter a valid season number', 'warning');
      return;
    }
    if (await this.tournaments.seasonExists(season)) {
      this.toast(`Season ${season} already exists`, 'warning');
      return;
    }
    if (this.selectedTeams().length < 2) {
      this.toast('Select at least 2 teams', 'warning');
      return;
    }
    // Sensible defaults: 2 pools when there are 4+ teams, one court per pool.
    if (!this.poolCount()) {
      const pools = this.selectedTeams().length >= 4 ? 2 : 1;
      this.poolCount.set(pools);
      this.courtCount.set(pools);
    }
    this.step.set('pools');
  }

  draw(): void {
    if (this.poolError()) return;
    const times = this.pools().map((p) => p.startTime);
    const drawn = drawPools(this.selectedTeams(), this.poolCount()!, this.courtCount()!);
    this.pools.set(drawn.map((p, i) => ({ ...p, startTime: times[i] ?? null })));
    this.step.set('draw');
  }

  setStartTime(index: number, value: string | null | undefined): void {
    this.pools.update((pools) =>
      pools.map((p, i) => (i === index ? { ...p, startTime: value || null } : p)),
    );
  }

  readonly missingTimes = computed(() => this.pools().some((p) => !p.startTime));

  async start(): Promise<void> {
    if (this.missingTimes()) {
      this.toast('Enter a start time for every pool', 'warning');
      return;
    }
    this.saving.set(true);
    try {
      const id = await this.tournaments.start(this.season()!, this.playedOn, this.courtCount()!, this.pools());
      await this.toast('Tournament started!', 'success');
      await this.nav.navigateRoot('/tabs/tournaments');
      await this.nav.navigateForward(['/tournaments', id, 'fixtures']);
    } catch {
      await this.toast('Could not start tournament', 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  back(): void {
    this.step.set(this.step() === 'draw' ? 'pools' : 'teams');
  }

  readonly courtName = courtName;
  readonly matchCount = (teams: number): number => (teams * (teams - 1)) / 2;

  toNumber(value: string | number | null | undefined): number | null {
    const n = Number(value);
    return value === '' || value == null || Number.isNaN(n) ? null : n;
  }

  private async toast(message: string, color: string): Promise<void> {
    const t = await this.toasts.create({ message, color, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
