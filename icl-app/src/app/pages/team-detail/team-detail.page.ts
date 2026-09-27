import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  call,
  callOutline,
  chatbubbleOutline,
  createOutline,
  locationOutline,
  personOutline,
  trashOutline,
} from 'ionicons/icons';
import { Team } from '../../core/models';
import { confirmAction } from '../../core/confirm';
import { TeamService } from '../../core/team.service';

@Component({
  selector: 'app-team-detail',
  imports: [
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
    IonLabel,
  ],
  templateUrl: './team-detail.page.html',
  styleUrl: './team-detail.page.scss',
})
export class TeamDetailPage {
  private readonly teams = inject(TeamService);
  private readonly alerts = inject(AlertController);
  private readonly nav = inject(NavController);

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly team = signal<Team | null>(null);

  constructor() {
    addIcons({ call, callOutline, personOutline, locationOutline, chatbubbleOutline, createOutline, trashOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    this.team.set(await this.teams.get(this.id));
  }

  telHref(phone: string): string {
    return 'tel:' + phone.replace(/[^\d+]/g, '');
  }

  async confirmDelete(): Promise<void> {
    const team = this.team();
    if (!team) return;
    if (await confirmAction(this.alerts, 'Delete team?', `"${team.name}" will be removed permanently.`, 'Delete')) {
      await this.teams.remove(this.id);
      await this.nav.navigateBack('/tabs/teams');
    }
  }
}
