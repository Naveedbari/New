import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, informationCircleOutline, trophy } from 'ionicons/icons';
import { Match, MatchScore, PoolFixtures } from '../../../core/models';
import { ballsToOvers, computeStandings, oversToBalls } from '../../../core/standings';

/** Editable text for one match's scorecard summary. */
interface Draft {
  batFirst: 1 | 2;
  inn1Runs: string;
  inn1Overs: string;
  inn2Runs: string;
  inn2Overs: string;
}

export interface NrrModalResult {
  scores: { matchId: number; score: MatchScore }[];
}

@Component({
  selector: 'app-nrr-modal',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter],
  templateUrl: './nrr-modal.component.html',
  styleUrl: './nrr-modal.component.scss',
})
export class NrrModalComponent implements OnInit {
  private readonly modalCtrl = inject(ModalController);

  @Input({ required: true }) group!: PoolFixtures;
  @Input({ required: true }) oversPerMatch!: number;
  @Input({ required: true }) qualifyCount!: number;

  readonly drafts = signal<Draft[]>([]);

  constructor() {
    addIcons({ closeOutline, informationCircleOutline, trophy });
  }

  /** Only played matches can have scores. */
  matches: Match[] = [];

  ngOnInit(): void {
    this.matches = this.group.matches.filter((m) => m.winner);
    const full = String(this.oversPerMatch);
    this.drafts.set(
      this.matches.map((m) =>
        m.score
          ? {
              batFirst: m.score.batFirst,
              inn1Runs: String(m.score.inn1Runs),
              inn1Overs: ballsToOvers(m.score.inn1Balls),
              inn2Runs: String(m.score.inn2Runs),
              inn2Overs: ballsToOvers(m.score.inn2Balls),
            }
          : { batFirst: this.guessBatFirst(m), inn1Runs: '', inn1Overs: full, inn2Runs: '', inn2Overs: '' },
      ),
    );
  }

  /** From the toss decision when known, otherwise team 1. */
  private guessBatFirst(m: Match): 1 | 2 {
    const toss = m.toss;
    if (toss?.decision) {
      const other: 1 | 2 = toss.winner === 1 ? 2 : 1;
      return toss.decision === 'bat' ? toss.winner : other;
    }
    return 1;
  }

  teamName(m: Match, side: 1 | 2): string {
    return side === 1 ? m.team1.name : m.team2.name;
  }

  update(index: number, patch: Partial<Draft>): void {
    this.drafts.update((list) => list.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  /** Validates a draft; returns the score or an error message. */
  parse(index: number): { score?: MatchScore; error?: string } {
    const d = this.drafts()[index]!;
    const maxBalls = this.oversPerMatch * 6;
    const r1 = d.inn1Runs.trim() === '' ? NaN : Number(d.inn1Runs);
    const r2 = d.inn2Runs.trim() === '' ? NaN : Number(d.inn2Runs);
    const b1 = oversToBalls(d.inn1Overs);
    const b2 = oversToBalls(d.inn2Overs);
    if (Number.isNaN(r1) || Number.isNaN(r2) || b1 === null || b2 === null) {
      return { error: 'Enter runs and overs for both innings.' };
    }
    if (!Number.isInteger(r1) || !Number.isInteger(r2) || r1 < 0 || r2 < 0) {
      return { error: 'Runs must be whole numbers.' };
    }
    if (b1 < 1 || b2 < 1 || b1 > maxBalls || b2 > maxBalls) {
      return { error: `Overs must be between 0.1 and ${this.oversPerMatch}.` };
    }
    return { score: { batFirst: d.batFirst, inn1Runs: r1, inn1Balls: b1, inn2Runs: r2, inn2Balls: b2 } };
  }

  /** Warns when the runs disagree with the recorded match winner. */
  mismatch(index: number): string {
    const m = this.matches[index]!;
    const { score } = this.parse(index);
    if (!score || !m.winner) return '';
    const chaser: 1 | 2 = score.batFirst === 1 ? 2 : 1;
    const runsWinner: 1 | 2 | null =
      score.inn2Runs > score.inn1Runs ? chaser : score.inn2Runs < score.inn1Runs ? score.batFirst : null;
    if (runsWinner === null) return 'Scores are level, but this match has a winner.';
    if (runsWinner !== m.winner) {
      return `These runs make ${this.teamName(m, runsWinner)} the winner, but the result says ${this.teamName(m, m.winner)}.`;
    }
    return '';
  }

  /** A match left completely blank is skipped; anything half-filled must be fixed first. */
  isBlank(index: number): boolean {
    const d = this.drafts()[index]!;
    return d.inn1Runs.trim() === '' && d.inn2Runs.trim() === '' && d.inn2Overs.trim() === '';
  }

  readonly canSave = computed(() => {
    const drafts = this.drafts();
    const filled = drafts.filter((_, i) => !this.isBlank(i));
    return filled.length > 0 && drafts.every((_, i) => this.isBlank(i) || !!this.parse(i).score);
  });

  /** Live points table with NRR from the scores typed so far. */
  readonly preview = computed(() => {
    const typed = new Map(this.matches.map((m, i) => [m.id, this.parse(i).score ?? null]));
    const matches = this.group.matches.map((m) => (typed.has(m.id) ? { ...m, score: typed.get(m.id)! } : m));
    return computeStandings({ pool: this.group.pool, matches }, this.qualifyCount);
  });

  formatNrr(nrr: number | null): string {
    if (nrr === null) return '–';
    return (nrr >= 0 ? '+' : '') + nrr.toFixed(3);
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    if (!this.canSave()) return;
    const scores = this.matches
      .map((m, i) => ({ matchId: m.id!, score: this.parse(i).score }))
      .filter((s): s is { matchId: number; score: MatchScore } => !!s.score);
    this.modalCtrl.dismiss({ scores } satisfies NrrModalResult, 'save');
  }
}
