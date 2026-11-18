import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { createGroup, groupSummary } from '../core/finance';
import { PkrPipe, initials } from '../core/ui';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PkrPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonNote],
  template: `
  <ion-header collapse="fade"><ion-toolbar><ion-title>My Groups</ion-title></ion-toolbar></ion-header>
  <ion-content [fullscreen]="true">
    <ion-header collapse="condense"><ion-toolbar><ion-title size="large">My Groups</ion-title></ion-toolbar></ion-header>
    <div class="wrap">
      @if (groups().length) {
        <div class="hero">
          <div class="label">Total held across {{ groups().length }} group{{ groups().length > 1 ? 's' : '' }}</div>
          <div class="big">{{ totalNet() | pkr }}</div>
          <div class="row"><div>Deposited<b>{{ totalDeposits() | pkr }}</b></div><div>Outstanding<b>{{ totalOutstanding() | pkr }}</b></div></div>
        </div>
        <ion-list class="inset" lines="full">
          @for (g of groups(); track g.group.id) {
            <ion-item [routerLink]="['/g', g.group.id]" detail>
              <div class="avatar" slot="start">{{ initials(g.group.name) }}</div>
              <ion-label>
                <h2><b>{{ g.group.name }}</b></h2>
                <p>{{ g.sum.members }} members · {{ g.group.description || 'No description' }}</p>
              </ion-label>
              <ion-note slot="end" class="amount" [class.neg]="g.sum.net < 0">{{ g.sum.net | pkr }}</ion-note>
            </ion-item>
          }
        </ion-list>
      } @else {
        <div class="empty">
          <ion-icon name="people-outline"></ion-icon>
          <h3>No groups yet</h3>
          <p>Create a group for your cricket team, trip or dinner crew, then add members and record deposits.</p>
        </div>
      }
    </div>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button (click)="newGroup()" aria-label="Create group"><ion-icon name="add"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>`,
})
export class HomePage {
  private store = inject(Store);
  private alerts = inject(AlertController);
  private router = inject(Router);
  initials = initials;
  groups = computed(() => { const s = this.store.state(); return s.groups.map(group => ({ group, sum: groupSummary(s, group.id) })); });
  totalNet = computed(() => this.groups().reduce((a, g) => a + g.sum.net, 0));
  totalDeposits = computed(() => this.groups().reduce((a, g) => a + g.sum.deposits, 0));
  totalOutstanding = computed(() => this.groups().reduce((a, g) => a + g.sum.outstanding, 0));

  async newGroup() {
    const a = await this.alerts.create({
      header: 'New group',
      inputs: [{ name: 'name', placeholder: 'e.g. Indoor Cricket Team' }, { name: 'description', placeholder: 'Description (optional)' }],
      buttons: [{ text: 'Cancel', role: 'cancel' }, {
        text: 'Create', handler: v => {
          let id = '';
          const ok = this.store.run(s => { const [n, g] = createGroup(s, v.name, v.description); id = g.id; return n; }, 'Group created');
          if (ok) this.router.navigate(['/g', id]);
          return ok;
        },
      }],
    });
    a.present();
  }
}
