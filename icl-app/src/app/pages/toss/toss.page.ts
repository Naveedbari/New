import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { refreshOutline } from 'ionicons/icons';
import { confirmAction } from '../../core/confirm';
import { CoinSide, Match, PoolTeam, TossDecision } from '../../core/models';
import { TournamentService } from '../../core/tournament.service';

type Step = 'caller' | 'call' | 'flipping' | 'result';

/** Fair coin using the platform's cryptographic random source. */
function flipCoin(): CoinSide {
  return crypto.getRandomValues(new Uint8Array(1))[0]! % 2 === 0 ? 'heads' : 'tails';
}

const FLIP_MS = 1800;

@Component({
  selector: 'app-toss',
  imports: [UpperCasePipe, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonContent],
  templateUrl: './toss.page.html',
  styleUrl: './toss.page.scss',
})
export class TossPage {
  private readonly service = inject(TournamentService);
  private readonly alerts = inject(AlertController);
  private readonly nav = inject(NavController);
  private readonly route = inject(ActivatedRoute).snapshot.paramMap;

  readonly tournamentId = Number(this.route.get('id'));
  readonly matchId = Number(this.route.get('matchId'));
  readonly match = signal<Match | null>(null);
  readonly step = signal<Step>('caller');
  readonly caller = signal<1 | 2 | null>(null);
  readonly call = signal<CoinSide | null>(null);
  /** Face shown on the coin; drives the final rotation of the flip animation. */
  readonly face = signal<CoinSide>('heads');
  readonly spinning = signal(false);

  readonly callerTeam = computed(() => this.teamOf(this.caller()));
  readonly winnerTeam = computed(() => this.teamOf(this.match()?.toss?.winner ?? null));

  constructor() {
    addIcons({ refreshOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    const groups = await this.service.fixtures(this.tournamentId);
    const match = groups.flatMap((g) => g.matches).find((m) => m.id === this.matchId) ?? null;
    this.match.set(match);
    if (match?.toss) {
      this.face.set(match.toss.result);
      this.step.set('result');
    }
  }

  teamOf(side: 1 | 2 | null): PoolTeam | null {
    const m = this.match();
    if (!m || !side) return null;
    return side === 1 ? m.team1 : m.team2;
  }

  initial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  chooseCaller(side: 1 | 2): void {
    this.caller.set(side);
    this.step.set('call');
  }

  async chooseCall(call: CoinSide): Promise<void> {
    const caller = this.caller();
    if (!caller) return;
    this.call.set(call);
    this.step.set('flipping');

    const result = flipCoin();
    const winner: 1 | 2 = call === result ? caller : caller === 1 ? 2 : 1;
    this.spinning.set(true);
    this.face.set(result);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    await new Promise((r) => setTimeout(r, reduceMotion ? 300 : FLIP_MS));
    this.spinning.set(false);

    const toss = { caller, call, result, winner, decision: null };
    await this.service.setToss(this.matchId, toss);
    this.match.update((m) => (m ? { ...m, toss } : m));
    this.step.set('result');
  }

  async setDecision(decision: TossDecision): Promise<void> {
    const toss = this.match()?.toss;
    if (!toss) return;
    const next = toss.decision === decision ? null : decision;
    await this.service.setTossDecision(this.matchId, next);
    this.match.update((m) => (m && m.toss ? { ...m, toss: { ...m.toss, decision: next } } : m));
  }

  async redo(): Promise<void> {
    const ok = await confirmAction(
      this.alerts,
      'Redo toss?',
      'The current toss result will be cleared.',
      'Redo toss',
    );
    if (!ok) return;
    await this.service.setToss(this.matchId, null);
    this.match.update((m) => (m ? { ...m, toss: null } : m));
    this.caller.set(null);
    this.call.set(null);
    this.step.set('caller');
  }

  done(): void {
    this.nav.navigateBack(['/tournaments', this.tournamentId, 'fixtures']);
  }
}
