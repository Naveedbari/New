import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, callOutline, logOutOutline, peopleOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { Team, TeamSearchField } from '../../core/models';
import { TeamService } from '../../core/team.service';

@Component({
  selector: 'app-teams',
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonFab,
    IonFabButton,
  ],
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.scss',
})
export class TeamsPage {
  private readonly teamsService = inject(TeamService);
  readonly auth = inject(AuthService);

  readonly teams = signal<Team[]>([]);
  readonly loaded = signal(false);
  term = '';
  field: TeamSearchField = 'all';

  readonly placeholders: Record<TeamSearchField, string> = {
    all: 'Search team, captain or phone',
    name: 'Search by team name',
    captain: 'Search by captain name',
    phone: 'Search by captain phone',
  };

  constructor() {
    addIcons({ add, logOutOutline, callOutline, personOutline, peopleOutline });
  }

  ionViewWillEnter(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.teams.set(await this.teamsService.search(this.term, this.field));
    this.loaded.set(true);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('');
  }
}
