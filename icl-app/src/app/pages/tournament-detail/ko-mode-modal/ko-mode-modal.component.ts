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
import { alertCircleOutline, calculatorOutline, closeOutline, gitNetworkOutline, shuffle, swapHorizontal, refreshOutline } from 'ionicons/icons';
import { KnockoutFormat, PoolTeam } from '../../../core/models';

export type KoPairs = [PoolTeam, PoolTeam | null][];

export interface KoModeResult {
  format: KnockoutFormat;
  pairs: KoPairs;
}

interface Option {
  format: KnockoutFormat;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-ko-mode-modal',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter],
  templateUrl: './ko-mode-modal.component.html',
  styleUrl: './ko-mode-modal.component.scss',
})
export class KoModeModalComponent implements OnInit {
  private readonly modalCtrl = inject(ModalController);

  /** All pool matches have runs/overs, so positions can be ranked by NRR. */
  @Input({ required: true }) nrrReady!: boolean;
  @Input({ required: true }) qualifiedCount!: number;
  @Input({ required: true }) crossPairs!: KoPairs;
  @Input() playoffPairs: KoPairs | null = null;
  /** Draws a fresh random set of pairs. */
  @Input({ required: true }) drawRandom!: () => KoPairs;

  readonly options: Option[] = [
    {
      format: 'random',
      title: 'Random draw',
      description: 'Qualified teams are drawn at random, one pool against the other.',
      icon: 'shuffle',
    },
    {
      format: 'cross',
      title: 'Winner vs runner-up',
      description: 'Pool winners play the other pool’s runner-up: A1 v B2 and B1 v A2.',
      icon: 'swap-horizontal',
    },
    {
      format: 'playoff',
      title: 'Knockout with a second chance',
      description:
        'Top 2 play Qualifier 1: the winner goes to the final, the loser gets another chance in Qualifier 2 against the winner of 3rd v 4th (Eliminator).',
      icon: 'git-network-outline',
    },
  ];

  readonly selected = signal<KnockoutFormat>('random');
  readonly randomPairs = signal<KoPairs>([]);

  ngOnInit(): void {
    addIcons({ shuffle, swapHorizontal, gitNetworkOutline, closeOutline, alertCircleOutline, calculatorOutline, refreshOutline });
    this.randomPairs.set(this.drawRandom());
  }

  /** Why an option can't be used right now, or '' when it can. */
  blocked(format: KnockoutFormat): string {
    if (format === 'random') return '';
    if (format === 'playoff' && this.qualifiedCount !== 4) {
      return `Needs exactly 4 qualified teams (you have ${this.qualifiedCount}).`;
    }
    if (!this.nrrReady) return 'Needs net run rate for every pool match so positions are decided correctly.';
    return '';
  }

  readonly preview = computed<{ label: string; a: string; b: string }[]>(() => {
    const f = this.selected();
    const name = (t: PoolTeam | null) => t?.name ?? 'Bye';
    if (f === 'playoff') {
      const p = this.playoffPairs ?? [];
      return [
        { label: 'Qualifier 1', a: name(p[0]?.[0] ?? null), b: name(p[0]?.[1] ?? null) },
        { label: 'Eliminator', a: name(p[1]?.[0] ?? null), b: name(p[1]?.[1] ?? null) },
        { label: 'Qualifier 2', a: 'Loser of Q1', b: 'Winner of Eliminator' },
        { label: 'Final', a: 'Winner of Q1', b: 'Winner of Q2' },
      ];
    }
    const pairs = f === 'random' ? this.randomPairs() : this.crossPairs;
    return pairs.map(([a, b], i) => ({ label: `Match ${i + 1}`, a: name(a), b: name(b) }));
  });

  select(format: KnockoutFormat): void {
    if (!this.blocked(format)) this.selected.set(format);
  }

  redraw(): void {
    this.randomPairs.set(this.drawRandom());
  }

  addRunRate(): void {
    this.modalCtrl.dismiss(null, 'nrr');
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  start(): void {
    const format = this.selected();
    if (this.blocked(format)) return;
    const pairs = format === 'random' ? this.randomPairs() : format === 'cross' ? this.crossPairs : this.playoffPairs!;
    this.modalCtrl.dismiss({ format, pairs } satisfies KoModeResult, 'start');
  }
}
