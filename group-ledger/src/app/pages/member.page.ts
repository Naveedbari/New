import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { memberSummaries, updateMember } from '../core/finance';
import { PkrPipe, TxLabelPipe, param } from '../core/ui';

@Component({
  selector: 'app-member',
  imports: [RouterLink, DatePipe, PkrPipe, TxLabelPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonLabel, IonNote],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>{{ m()?.member?.name }}</ion-title>
    @if (captain()) { <ion-buttons slot="end"><ion-button (click)="edit()" aria-label="Edit member"><ion-icon slot="icon-only" name="create-outline"></ion-icon></ion-button></ion-buttons> }
  </ion-toolbar></ion-header>
  <ion-content>
  @if (m(); as m) {
    <div class="wrap">
      @if (!m.member.active) { <div class="banner warn"><ion-icon name="warning"></ion-icon> Inactive member — history is kept, no new charges.</div> }
      <div class="hero">
        <div class="label">Current balance</div>
        <div class="big">{{ m.balance | pkr }}</div>
        <div class="row"><div>Outstanding<b>{{ m.outstanding | pkr }}</b></div><div>Events<b>{{ m.events }}</b></div></div>
      </div>
      <div class="stats">
        <div><small>Deposited</small><b>{{ m.deposits | pkr }}</b></div>
        <div><small>Expense shares</small><b>{{ m.expenses | pkr }}</b></div>
        <div><small>Fines & charges</small><b>{{ m.charges | pkr }}</b></div>
        <div><small>Refunds & credits</small><b>{{ m.refunds + m.credits - m.debits | pkr }}</b></div>
      </div>
      @if (captain() && m.member.active) {
        <div class="ion-padding-horizontal" style="display:flex; gap:8px">
          <ion-button expand="block" style="flex:1" [routerLink]="['/g', groupId(), 'money']" [queryParams]="{ member: m.member.id }"><ion-icon slot="start" name="cash-outline"></ion-icon>Deposit</ion-button>
          <ion-button expand="block" style="flex:1" fill="outline" [routerLink]="['/g', groupId(), 'money']" [queryParams]="{ member: m.member.id, type: 'credit_adj' }"><ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>Adjust</ion-button>
        </div>
      }
      <div class="section"><h2>Transactions</h2></div>
      <ion-list class="inset">
        @for (t of txs(); track t.id) {
          <ion-item [routerLink]="t.eventId ? ['/g', groupId(), 'e', t.eventId] : null" [detail]="!!t.eventId">
            <ion-icon slot="start" [name]="t.delta >= 0 ? 'arrow-down-circle' : 'arrow-up-circle'" [color]="t.delta >= 0 ? 'success' : 'danger'"></ion-icon>
            <ion-label>{{ t.description }}<p>{{ t.type | txLabel }} · {{ t.date | date: 'mediumDate' }}{{ t.method ? ' · ' + t.method : '' }}</p></ion-label>
            <ion-note slot="end" class="amount" [class.pos]="t.delta > 0" [class.neg]="t.delta < 0">{{ t.delta > 0 ? '+' : '' }}{{ t.delta | pkr }}</ion-note>
          </ion-item>
        } @empty { <ion-item><ion-label class="muted">No transactions yet.</ion-label></ion-item> }
      </ion-list>
      @if (m.member.phone) { <p class="muted ion-text-center">{{ m.member.phone }} · joined {{ m.member.joinedAt | date: 'mediumDate' }}</p> }
    </div>
  }
  </ion-content>`,
})
export class MemberPage {
  private store = inject(Store);
  private alerts = inject(AlertController);
  groupId = param('groupId');
  memberId = param('memberId');
  viewAs = computed(() => this.store.viewAs()[this.groupId()]);
  captain = computed(() => !this.viewAs());
  // Member view may only open their own record.
  m = computed(() => (this.captain() || this.viewAs() === this.memberId())
    ? memberSummaries(this.store.state(), this.groupId()).find(x => x.member.id === this.memberId()) : undefined);
  txs = computed(() => this.store.state().txs.filter(t => t.memberId === this.memberId()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

  async edit() {
    const mem = this.m()!.member;
    const a = await this.alerts.create({
      header: 'Edit member',
      inputs: [{ name: 'name', value: mem.name, placeholder: 'Full name' }, { name: 'phone', type: 'tel', value: mem.phone, placeholder: 'Phone' }],
      buttons: [
        { text: mem.active ? 'Deactivate' : 'Reactivate', role: 'destructive', handler: () => this.store.run(s => updateMember(s, mem.id, { active: !mem.active }), mem.active ? 'Member deactivated' : 'Member reactivated') },
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: v => this.store.run(s => updateMember(s, mem.id, { name: v.name, phone: v.phone }), 'Saved') },
      ],
    });
    a.present();
  }
}
