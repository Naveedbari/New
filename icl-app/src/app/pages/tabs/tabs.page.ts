import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, people, settings, trophy } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="home"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tournaments">
          <ion-icon name="trophy"></ion-icon>
          <ion-label>Tournaments</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="teams">
          <ion-icon name="people"></ion-icon>
          <ion-label>Teams</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings">
          <ion-icon name="settings"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ home, people, settings, trophy });
  }
}
