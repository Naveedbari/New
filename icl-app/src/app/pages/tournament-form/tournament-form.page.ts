import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Team } from '../../core/models';
import { TeamService } from '../../core/team.service';
import { confirmAction } from '../../core/confirm';
import { TournamentService } from '../../core/tournament.service';

const today = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

@Component({
  selector: 'app-tournament-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonNote,
  ],
  templateUrl: './tournament-form.page.html',
})
export class TournamentFormPage {
  private readonly tournaments = inject(TournamentService);
  private readonly teamService = inject(TeamService);
  private readonly nav = inject(NavController);
  private readonly toasts = inject(ToastController);
  private readonly alerts = inject(AlertController);

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || undefined;
  readonly teams = signal<Team[]>([]);
  readonly saving = signal(false);
  readonly isOngoing = signal(false);
  /** Champion name kept from the saved record, used if that team was deleted. */
  private savedChampionName = '';

  readonly form = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    playedOn: [today(), Validators.required],
    championTeamId: [null as number | null, Validators.required],
    mvpName: ['', [Validators.required, Validators.maxLength(60)]],
  });

  constructor() {
    addIcons({ trashOutline });
    this.load();
  }

  private async load(): Promise<void> {
    const allTeams = await this.teamService.search('');
    this.teams.set(allTeams);
    if (!this.id) return;
    const t = await this.tournaments.get(this.id);
    if (!t) return;
    this.isOngoing.set(t.status === 'ongoing');
    // A drawn tournament's champion must be one of its participating teams.
    const participants = new Set(t.pools?.flatMap((p) => p.teams.map((pt) => pt.teamId)) ?? []);
    if (participants.size) {
      this.teams.set(allTeams.filter((team) => participants.has(team.id ?? null)));
    }
    this.savedChampionName = t.championTeamName ?? '';
    this.form.patchValue(t);
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const team = this.teams().find((t) => t.id === v.championTeamId);
    this.saving.set(true);
    try {
      await this.tournaments.save({
        id: this.id,
        name: v.name!,
        playedOn: v.playedOn!,
        status: 'completed',
        championTeamId: v.championTeamId,
        championTeamName: team?.name ?? this.savedChampionName,
        mvpName: v.mvpName!,
      });
      await this.toast(this.id ? 'Result saved' : 'Tournament result added', 'success');
      this.nav.navigateRoot('/tabs/home');
    } catch {
      await this.toast('Could not save tournament', 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  async confirmDelete(): Promise<void> {
    if (!this.id) return;
    if (await confirmAction(this.alerts, 'Delete tournament?', 'This tournament will be removed permanently.', 'Delete')) {
      await this.tournaments.remove(this.id);
      await this.nav.navigateRoot('/tabs/tournaments');
    }
  }

  private async toast(message: string, color: string): Promise<void> {
    const t = await this.toasts.create({ message, color, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
