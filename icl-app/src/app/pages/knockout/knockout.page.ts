import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
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
import { ribbonOutline, trophy, trophyOutline } from 'ionicons/icons';
import { confirmAction } from '../../core/confirm';
import { Match, MatchWinner, PoolTeam, Tournament } from '../../core/models';
import { TournamentService, knockoutRoundName, koMatchLabel, koRoundTitle } from '../../core/tournament.service';
import { BracketMatch, buildBracket, knockoutChampion } from '../../core/bracket';

interface KoRound {
  number: number;
  name: string;
  matches: Match[];
}

@Component({
  selector: 'app-knockout',
  imports: [NgTemplateOutlet, RouterLink, IonLabel, IonSegment, IonSegmentButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonContent],
  templateUrl: './knockout.page.html',
  styleUrls: ['../fixtures/fixtures.page.scss', './knockout.page.scss'],
})
export class KnockoutPage {
  private readonly service = inject(TournamentService);
  private readonly sheets = inject(ActionSheetController);
  private readonly alerts = inject(AlertController);

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly tournament = signal<Tournament | null>(null);
  readonly matches = signal<Match[]>([]);
  readonly loaded = signal(false);

  readonly rounds = computed<KoRound[]>(() => {
    const byRound = new Map<number, Match[]>();
    for (const m of this.matches()) {
      const r = m.koRound ?? 1;
      byRound.set(r, [...(byRound.get(r) ?? []), m]);
    }
    return [...byRound.entries()]
      .sort(([a], [b]) => a - b)
      .map(([number, matches]) => ({ number, name: koRoundTitle(this.format(), number, matches.length), matches }));
  });

  readonly view = signal<'bracket' | 'matches'>('bracket');
  readonly format = computed(() => this.tournament()?.koFormat ?? 'cross');

  /** Label for one match card, e.g. "Qualifier 1", "Semi-final 2", "Final". */
  label(m: Match): string {
    const size = this.matches().filter((x) => x.koRound === m.koRound).length;
    const base = koMatchLabel(this.format(), m, size);
    return this.format() !== 'playoff' && size > 1 ? `${base} ${m.position + 1}` : base;
  }

  /** Playoff map boxes (option 3): Q1, Eliminator, Q2 and Final, with TBD until known. */
  readonly playoff = computed(() => {
    const ko = this.matches();
    const at = (r: number, p: number) => ko.find((m) => m.koRound === r && m.position === p) ?? null;
    const box = (m: Match | null, round: number, index: number, top: PoolTeam | null, bottom: PoolTeam | null): BracketMatch => ({
      round,
      index,
      match: m,
      isBye: false,
      top: m ? { team: m.team1, won: m.winner === 1, lost: m.winner === 2 } : { team: top, won: false, lost: false },
      bottom: m ? { team: m.team2, won: m.winner === 2, lost: m.winner === 1 } : { team: bottom, won: false, lost: false },
    });
    const winner = (m: Match | null) => (m?.winner ? (m.winner === 1 ? m.team1 : m.team2) : null);
    const loser = (m: Match | null) => (m?.winner ? (m.winner === 1 ? m.team2 : m.team1) : null);
    const q1 = at(1, 0);
    const elim = at(1, 1);
    const q2 = at(2, 0);
    return {
      q1: box(q1, 1, 0, null, null),
      elim: box(elim, 1, 1, null, null),
      q2: box(q2, 2, 0, loser(q1), winner(elim)),
      final: box(at(3, 0), 3, 0, winner(q1), winner(q2)),
    };
  });

  /** Every bracket round, first round to final, including future (TBD) matches. */
  readonly bracket = computed(() => buildBracket(this.matches()));

  /**
   * Two-sided layout: the first half of each round feeds in from the left, the second half
   * from the right, meeting at the final in the middle. Columns: left rounds, final, right rounds.
   */
  readonly bracketSides = computed(() => {
    const rounds = this.bracket();
    const early = rounds.slice(0, -1);
    return {
      left: early.map((r) => r.slice(0, r.length / 2)),
      right: early.map((r) => r.slice(r.length / 2)).reverse(),
      final: rounds[rounds.length - 1]?.[0] ?? null,
      names: early.map((r) => knockoutRoundName(r.length)),
    };
  });

  /** Groups a column's boxes into pairs that feed the same next-round match. */
  pairs(column: BracketMatch[]): BracketMatch[][] {
    const out: BracketMatch[][] = [];
    for (let i = 0; i < column.length; i += 2) out.push(column.slice(i, i + 2));
    return out;
  }

  /** Tapping a playable bracket box records its result. */
  tapBox(b: BracketMatch): void {
    if (b.match && !b.isBye) this.pickWinner(b.match);
  }

  /** Champion once the final is decided. */
  readonly champion = computed<PoolTeam | null>(() => knockoutChampion(this.matches(), this.format()));

  constructor() {
    addIcons({ trophy, trophyOutline, ribbonOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.tournament.set(await this.service.get(this.id));
    await this.reload();
    this.loaded.set(true);
  }

  private async reload(): Promise<void> {
    this.matches.set(await this.service.knockout(this.id));
  }

  team(match: Match, side: 1 | 2): PoolTeam {
    return side === 1 ? match.team1 : match.team2;
  }

  initial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  /** Match number across the whole knockout, skipping byes. */
  matchNumber(match: Match): number {
    return this.matches().filter((m) => !m.isBye).indexOf(match) + 1;
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
    if (role === 'cancel' || role === 'backdrop' || data === undefined || data === match.winner) return;

    // Later rounds depend on this result, so they are rebuilt; warn if they already have results.
    const laterPlayed = this.matches().some(
      (m) => (m.koRound ?? 0) > (match.koRound ?? 0) && !m.isBye && m.winner,
    );
    if (
      laterPlayed &&
      !(await confirmAction(
        this.alerts,
        'Change this result?',
        'Later knockout rounds already have results. They will be cleared and redrawn from the new winners.',
        'Change result',
      ))
    ) {
      return;
    }
    await this.service.setKnockoutWinner(this.id, match.id!, data);
    await this.reload();
  }
}
