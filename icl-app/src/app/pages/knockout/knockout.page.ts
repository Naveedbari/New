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
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ribbonOutline, trophy, trophyOutline } from 'ionicons/icons';
import { confirmAction } from '../../core/confirm';
import { Match, MatchWinner, PoolTeam, Tournament } from '../../core/models';
import { TournamentService, knockoutRoundName } from '../../core/tournament.service';

interface KoRound {
  number: number;
  name: string;
  matches: Match[];
}

@Component({
  selector: 'app-knockout',
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonContent],
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
      .map(([number, matches]) => ({ number, name: knockoutRoundName(matches.length), matches }));
  });

  /** Champion once the final (a round with a single match) has a winner. */
  readonly champion = computed<PoolTeam | null>(() => {
    const rounds = this.rounds();
    const last = rounds[rounds.length - 1];
    if (!last || last.matches.length !== 1) return null;
    const final = last.matches[0]!;
    if (!final.winner) return null;
    return final.winner === 1 ? final.team1 : final.team2;
  });

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
