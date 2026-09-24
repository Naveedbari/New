import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mapOutline, settingsOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state.component';
import { SystemStatusStore } from './system-status.store';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  providers: [SystemStatusStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  protected readonly store = inject(SystemStatusStore);

  constructor() {
    addIcons({ mapOutline, settingsOutline });
  }

  ngOnInit(): void {
    void this.store.load();
  }
}
