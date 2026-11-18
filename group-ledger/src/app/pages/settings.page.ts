import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput, IonTextarea, IonToggle, IonSelect, IonSelectOption, IonNote } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { param } from '../core/ui';
import { formatPKR, toPaisa, updateGroup } from '../core/finance';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput, IonTextarea, IonToggle, IonSelect, IonSelectOption, IonNote],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>Group settings</ion-title>
  </ion-toolbar></ion-header>
  <ion-content>
  <div class="wrap" style="padding-top:8px">
    <div class="section"><h2>Viewing as</h2></div>
    <ion-list class="inset">
      <ion-item>
        <ion-select label="Role" interface="action-sheet" [value]="viewAs() || ''" (ionChange)="store.setViewAs(groupId(), $event.detail.value || null)">
          <ion-select-option value="">Captain (admin)</ion-select-option>
          @for (m of members(); track m.id) { <ion-select-option [value]="m.id">Member: {{ m.name }}</ion-select-option> }
        </ion-select>
      </ion-item>
    </ion-list>
    <p class="muted ion-padding-horizontal" style="font-size:12px; margin-top:-8px">Preview what a member sees. Real sign-in and per-user permissions arrive with the backend.</p>

    @if (!viewAs() && group(); as g) {
      <div class="section"><h2>Group</h2></div>
      <ion-list class="inset">
        <ion-item><ion-input label="Name" labelPlacement="stacked" [(ngModel)]="name"></ion-input></ion-item>
        <ion-item><ion-textarea label="Description" labelPlacement="stacked" autoGrow [(ngModel)]="description"></ion-textarea></ion-item>
      </ion-list>
      <div class="section"><h2>Money rules</h2></div>
      <ion-list class="inset">
        <ion-item><ion-toggle [(ngModel)]="allowOverdraft">Allow outstanding balances<br><ion-note>Captain may confirm charges beyond a member's balance</ion-note></ion-toggle></ion-item>
        <ion-item><ion-input label="Low balance alert below (PKR)" labelPlacement="stacked" inputmode="decimal" [(ngModel)]="low"></ion-input></ion-item>
      </ion-list>
      <div class="ion-padding-horizontal"><ion-button expand="block" (click)="save()">Save settings</ion-button></div>
    }
  </div>
  </ion-content>`,
})
export class SettingsPage {
  store = inject(Store);
  groupId = param('groupId');
  group = this.store.group(this.groupId);
  viewAs = computed(() => this.store.viewAs()[this.groupId()]);
  members = computed(() => this.store.state().members.filter(m => m.groupId === this.groupId() && m.active));
  name = ''; description = ''; allowOverdraft = true; low = '';

  ngOnInit() {
    const g = this.group();
    if (!g) return;
    this.name = g.name; this.description = g.description; this.allowOverdraft = g.settings.allowOverdraft;
    this.low = formatPKR(g.settings.lowBalance).replace(/PKR |,/g, '');
  }

  save() {
    let lowBalance: number;
    try { lowBalance = toPaisa(this.low || '0'); } catch (e) { { this.store.say((e as Error).message, 'danger'); return; } }
    this.store.run(s => updateGroup(s, this.groupId(), { name: this.name, description: this.description, settings: { allowOverdraft: this.allowOverdraft, lowBalance } }), 'Settings saved');
  }
}
