import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { voidEvent } from '../core/finance';
import { PkrPipe, param } from '../core/ui';

@Component({
  selector: 'app-event',
  imports: [DatePipe, PkrPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonBadge],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>Event</ion-title>
  </ion-toolbar></ion-header>
  <ion-content>
  @if (ev(); as e) {
    <div class="wrap">
      <div class="hero">
        <div class="label">{{ e.category }} · {{ e.date | date: 'fullDate' }}</div>
        <div class="big">{{ e.total | pkr }}</div>
        <div class="row"><div>{{ e.title }}<b>{{ e.lines.length }} participants</b></div><div>Fines & extras<b>{{ extras() | pkr }}</b></div></div>
      </div>
      @if (e.status === 'voided') { <div class="banner warn"><ion-icon name="warning"></ion-icon> Voided — all charges were reversed.</div> }
      @if (e.description) { <div class="card">{{ e.description }}</div> }
      <div class="section"><h2>Breakdown</h2></div>
      <div class="card">
        <table class="t">
          <tr><th>Member</th><th class="r">Share</th><th class="r">Extra</th><th class="r">Total</th></tr>
          @for (l of visible(); track l.memberId) {
            <tr [class.strike]="e.status === 'voided'">
              <td>{{ name(l.memberId) }}@if (l.extraReason) {<br><small class="muted">{{ l.extraReason }}</small>}</td>
              <td class="r amount">{{ l.base | pkr }}</td><td class="r amount">{{ l.extra ? (l.extra | pkr) : '—' }}</td><td class="r amount">{{ l.total | pkr }}</td>
            </tr>
          }
        </table>
        <p class="muted" style="font-size:12px; margin:8px 0 0">Recorded by {{ e.createdBy }} on {{ e.createdAt | date: 'medium' }}</p>
      </div>
      @if (captain() && e.status === 'posted') {
        <div class="ion-padding-horizontal">
          <ion-button expand="block" color="danger" fill="outline" (click)="voidIt()"><ion-icon slot="start" name="trash-outline"></ion-icon>Void event</ion-button>
          <p class="muted ion-text-center" style="font-size:12px">Voiding reverses every charge. To change an event, void it and create a corrected one.</p>
        </div>
      }
    </div>
  } @else { <div class="empty"><ion-badge color="medium">Not found</ion-badge></div> }
  </ion-content>`,
})
export class EventPage {
  private store = inject(Store);
  private alerts = inject(AlertController);
  groupId = param('groupId');
  eventId = param('eventId');
  ev = computed(() => this.store.state().events.find(e => e.id === this.eventId() && e.groupId === this.groupId()));
  viewAs = computed(() => this.store.viewAs()[this.groupId()]);
  captain = computed(() => !this.viewAs());
  // Members see the event, but only their own line of the charges.
  visible = computed(() => (this.ev()?.lines ?? []).filter(l => this.captain() || l.memberId === this.viewAs()));
  extras = computed(() => (this.ev()?.lines ?? []).reduce((s, l) => s + l.extra, 0));
  name = (id: string) => this.store.state().members.find(m => m.id === id)?.name ?? '';

  async voidIt() {
    const a = await this.alerts.create({
      header: 'Void event?', message: 'All charges will be reversed and balances restored. The event stays in history.',
      inputs: [{ name: 'reason', placeholder: 'Reason (required)' }],
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Void', role: 'destructive', handler: v => this.store.run(s => voidEvent(s, this.eventId(), v.reason, this.store.user), 'Event voided') }],
    });
    a.present();
  }
}
