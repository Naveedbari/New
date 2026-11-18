import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonSegment, IonSegmentButton,
  IonLabel, IonList, IonItem, IonNote, IonFab, IonFabButton, IonFabList, IonBadge, IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { addMember, groupSummary, memberSummaries, reverseTx, Tx } from '../core/finance';
import { CATEGORY_ICON, PkrPipe, TxLabelPipe, initials, param } from '../core/ui';

@Component({
  selector: 'app-group',
  imports: [RouterLink, DatePipe, NgTemplateOutlet, PkrPipe, TxLabelPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonNote, IonFab, IonFabButton, IonFabList, IonBadge, IonItemSliding, IonItemOptions, IonItemOption],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start"><ion-back-button defaultHref="/" text=""></ion-back-button></ion-buttons>
      <ion-title>{{ group()?.name }}</ion-title>
      <ion-buttons slot="end">
        <ion-button [routerLink]="['/g', groupId(), 'reports']" aria-label="Reports"><ion-icon slot="icon-only" name="bar-chart-outline"></ion-icon></ion-button>
        <ion-button [routerLink]="['/g', groupId(), 'settings']" aria-label="Settings"><ion-icon slot="icon-only" name="settings-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-segment [value]="tab()" (ionChange)="tab.set($any($event.detail.value))">
        <ion-segment-button value="overview"><ion-label>Overview</ion-label></ion-segment-button>
        @if (captain()) { <ion-segment-button value="members"><ion-label>Members</ion-label></ion-segment-button> }
        <ion-segment-button value="events"><ion-label>Events</ion-label></ion-segment-button>
        <ion-segment-button value="history"><ion-label>History</ion-label></ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>

  <ion-content>
  <div class="wrap">
    @if (!captain() && me(); as m) {
      <div class="banner info"><ion-icon name="eye-outline"></ion-icon> Member view: {{ m.member.name }} (read-only)</div>
    }
    @switch (tab()) {
      @case ('overview') {
        @if (me(); as m) {
          <div class="hero" [routerLink]="['/g', groupId(), 'm', m.member.id]">
            <div class="label">My balance</div>
            <div class="big">{{ m.balance | pkr }}</div>
            <div class="row"><div>Deposited<b>{{ m.deposits | pkr }}</b></div><div>Spent<b>{{ m.expenses + m.charges | pkr }}</b></div><div>Outstanding<b>{{ m.outstanding | pkr }}</b></div></div>
          </div>
        } @else {
          <div class="hero">
            <div class="label">Group funds (net)</div>
            <div class="big">{{ sum().net | pkr }}</div>
            <div class="row"><div>Available<b>{{ sum().available | pkr }}</b></div><div>Outstanding<b>{{ sum().outstanding | pkr }}</b></div></div>
          </div>
        }
        <div class="stats">
          <div><small>Total deposited</small><b>{{ sum().deposits | pkr }}</b></div>
          <div><small>Total expenses</small><b>{{ sum().expenses | pkr }}</b></div>
          <div><small>Fines & charges</small><b>{{ sum().charges | pkr }}</b></div>
          <div><small>Active members</small><b>{{ sum().members }}</b></div>
        </div>
        @if (captain()) {
          @if (low().length) {
            <div class="section"><h2>Needs attention</h2></div>
            <ion-list class="inset">
              @for (m of low(); track m.member.id) {
                <ion-item [routerLink]="['/g', groupId(), 'm', m.member.id]" detail>
                  <ion-icon slot="start" [name]="m.balance < 0 ? 'alert-circle' : 'warning'" [color]="m.balance < 0 ? 'danger' : 'warning'"></ion-icon>
                  <ion-label>{{ m.member.name }}<p>{{ m.balance < 0 ? 'Outstanding ' : 'Low balance' }}</p></ion-label>
                  <ion-note slot="end" class="amount" [class.neg]="m.balance < 0">{{ m.balance | pkr }}</ion-note>
                </ion-item>
              }
            </ion-list>
          }
          <div class="section"><h2>Balances</h2></div>
          <ion-list class="inset">
            @for (m of active(); track m.member.id) {
              <ion-item [routerLink]="['/g', groupId(), 'm', m.member.id]" detail>
                <div class="avatar" slot="start">{{ initials(m.member.name) }}</div>
                <ion-label>{{ m.member.name }}</ion-label>
                <ion-note slot="end" class="amount" [class.neg]="m.balance < 0">{{ m.balance | pkr }}</ion-note>
              </ion-item>
            } @empty { <ion-item><ion-label class="muted">Add members to get started.</ion-label></ion-item> }
          </ion-list>
        }
        <div class="section"><h2>Recent activity</h2></div>
        <ion-list class="inset">
          @for (t of txs().slice(0, 6); track t.id) { <ng-container *ngTemplateOutlet="txRow; context: { $implicit: t }" /> }
          @empty { <ion-item><ion-label class="muted">No transactions yet.</ion-label></ion-item> }
        </ion-list>
      }

      @case ('members') {
        <div class="section"><h2>{{ active().length }} active</h2><ion-button fill="clear" size="small" (click)="newMember()"><ion-icon slot="start" name="person-add-outline"></ion-icon>Add</ion-button></div>
        <ion-list class="inset">
          @for (m of members(); track m.member.id) {
            <ion-item [routerLink]="['/g', groupId(), 'm', m.member.id]" detail [class.strike]="!m.member.active">
              <div class="avatar" slot="start">{{ initials(m.member.name) }}</div>
              <ion-label>{{ m.member.name }}<p>{{ m.events }} event{{ m.events === 1 ? '' : 's' }} · deposited {{ m.deposits | pkr }}</p></ion-label>
              @if (!m.member.active) { <ion-badge color="medium" slot="end">Inactive</ion-badge> }
              <ion-note slot="end" class="amount" [class.neg]="m.balance < 0">{{ m.balance | pkr }}</ion-note>
            </ion-item>
          } @empty { <ion-item><ion-label class="muted">No members yet.</ion-label></ion-item> }
        </ion-list>
      }

      @case ('events') {
        <ion-list class="inset" style="margin-top:12px">
          @for (e of events(); track e.id) {
            <ion-item [routerLink]="['/g', groupId(), 'e', e.id]" detail>
              <ion-icon slot="start" [name]="icon[e.category] || 'receipt-outline'" color="primary"></ion-icon>
              <ion-label [class.strike]="e.status === 'voided'">{{ e.title }}<p>{{ e.date | date: 'mediumDate' }} · {{ e.lines.length }} participants</p></ion-label>
              @if (e.status === 'voided') { <ion-badge color="medium" slot="end">Voided</ion-badge> }
              <ion-note slot="end" class="amount">{{ e.total | pkr }}</ion-note>
            </ion-item>
          } @empty { <ion-item><ion-label class="muted">No events yet.</ion-label></ion-item> }
        </ion-list>
      }

      @case ('history') {
        <ion-list class="inset" style="margin-top:12px">
          @for (t of txs(); track t.id) {
            <ion-item-sliding [disabled]="!captain() || !!t.eventId || t.type === 'reversal' || reversed().has(t.id)">
              <ng-container *ngTemplateOutlet="txRow; context: { $implicit: t }" />
              <ion-item-options side="end"><ion-item-option color="danger" (click)="reverse(t)"><ion-icon slot="start" name="refresh-outline"></ion-icon>Reverse</ion-item-option></ion-item-options>
            </ion-item-sliding>
          } @empty { <ion-item><ion-label class="muted">No transactions yet.</ion-label></ion-item> }
        </ion-list>
        @if (captain()) { <p class="muted ion-text-center" style="font-size:12px">Swipe left on a deposit or adjustment to reverse it. Event charges are corrected by voiding the event.</p> }
      }
    }
  </div>

  <ng-template #txRow let-t>
    <ion-item>
      <ion-icon slot="start" [name]="t.delta >= 0 ? 'arrow-down-circle' : 'arrow-up-circle'" [color]="t.delta >= 0 ? 'success' : 'danger'"></ion-icon>
      <ion-label [class.strike]="reversed().has(t.id)">
        {{ name(t.memberId) }}
        <p>{{ t.type | txLabel }} · {{ t.description }}</p>
        <p>{{ t.date | date: 'mediumDate' }}</p>
      </ion-label>
      <ion-note slot="end" class="amount" [class.pos]="t.delta > 0" [class.neg]="t.delta < 0">{{ t.delta > 0 ? '+' : '' }}{{ t.delta | pkr }}</ion-note>
    </ion-item>
  </ng-template>

  @if (captain() && group()) {
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button aria-label="Actions"><ion-icon name="add"></ion-icon></ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button [routerLink]="['/g', groupId(), 'event']" color="light" title="New expense event"><ion-icon name="receipt-outline"></ion-icon></ion-fab-button>
        <ion-fab-button [routerLink]="['/g', groupId(), 'money']" color="light" title="Record deposit"><ion-icon name="cash-outline"></ion-icon></ion-fab-button>
        <ion-fab-button (click)="newMember()" color="light" title="Add member"><ion-icon name="person-add-outline"></ion-icon></ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  }
  </ion-content>`,
})
export class GroupPage {
  private store = inject(Store);
  private alerts = inject(AlertController);
  groupId = param('groupId');
  tab = signal<'overview' | 'members' | 'events' | 'history'>('overview');
  icon = CATEGORY_ICON;
  initials = initials;

  group = this.store.group(this.groupId);
  viewAs = computed(() => this.store.viewAs()[this.groupId()]);
  captain = computed(() => !this.viewAs());
  sum = computed(() => groupSummary(this.store.state(), this.groupId()));
  members = computed(() => memberSummaries(this.store.state(), this.groupId()).sort((a, b) => +b.member.active - +a.member.active || a.member.name.localeCompare(b.member.name)));
  active = computed(() => this.members().filter(m => m.member.active));
  me = computed(() => this.members().find(m => m.member.id === this.viewAs()));
  low = computed(() => { const lim = this.group()?.settings.lowBalance ?? 0; return this.active().filter(m => m.balance < lim).sort((a, b) => a.balance - b.balance); });
  reversed = computed(() => new Set(this.store.state().txs.filter(t => t.reversesId).map(t => t.reversesId!)));
  events = computed(() => this.store.state().events.filter(e => e.groupId === this.groupId()).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)));
  txs = computed(() => this.store.state().txs
    .filter(t => t.groupId === this.groupId() && (this.captain() || t.memberId === this.viewAs()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

  name(id: string) { return this.store.state().members.find(m => m.id === id)?.name ?? 'Unknown'; }

  async newMember() {
    const a = await this.alerts.create({
      header: 'Add member',
      inputs: [{ name: 'name', placeholder: 'Full name' }, { name: 'phone', type: 'tel', placeholder: 'Phone (optional)' }],
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Add', handler: v => this.store.run(s => addMember(s, this.groupId(), v.name, v.phone)[0], `${v.name} added`) }],
    });
    a.present();
  }

  async reverse(t: Tx) {
    const a = await this.alerts.create({
      header: 'Reverse transaction', message: 'A reversing entry will be recorded. The original stays in history.',
      inputs: [{ name: 'reason', placeholder: 'Reason (required)' }],
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Reverse', role: 'destructive', handler: v => this.store.run(s => reverseTx(s, t.id, v.reason, this.store.user), 'Transaction reversed') }],
    });
    a.present();
  }
}
