import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonInput, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { TX_LABEL, balances, totals } from '../core/finance';
import { PkrPipe, param } from '../core/ui';

type Period = 'day' | 'week' | 'month';

/** ISO-ish bucket key for a YYYY-MM-DD date. Weeks start Monday. */
function bucket(date: string, p: Period): string {
  if (p === 'day') return date;
  if (p === 'month') return date.slice(0, 7);
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return 'Week of ' + d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-reports',
  imports: [FormsModule, DatePipe, PkrPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonItem, IonInput, IonSegment, IonSegmentButton, IonLabel],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>Reports</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="csv()" aria-label="Export CSV for Excel"><ion-icon slot="icon-only" name="download-outline"></ion-icon></ion-button>
      <ion-button (click)="print()">PDF</ion-button>
    </ion-buttons>
  </ion-toolbar></ion-header>
  <ion-content>
  <div class="wrap" style="padding-top:8px">
    <ion-list class="inset">
      <ion-item><ion-input label="From" labelPlacement="stacked" type="date" [ngModel]="from()" (ngModelChange)="from.set($event)"></ion-input></ion-item>
      <ion-item><ion-input label="To" labelPlacement="stacked" type="date" [ngModel]="to()" (ngModelChange)="to.set($event)"></ion-input></ion-item>
    </ion-list>
    <div class="stats">
      <div><small>Deposits</small><b>{{ t().deposits | pkr }}</b></div>
      <div><small>Expense shares</small><b>{{ t().expenses | pkr }}</b></div>
      <div><small>Fines & charges</small><b>{{ t().charges | pkr }}</b></div>
      <div><small>Refunds / adj. (net)</small><b>{{ t().refunds + t().credits - t().debits | pkr }}</b></div>
    </div>

    <div class="section"><h2>Expenses by period</h2></div>
    <ion-segment [value]="period()" (ionChange)="period.set($any($event.detail.value))" style="margin:0 16px 12px; width:auto">
      <ion-segment-button value="day"><ion-label>Daily</ion-label></ion-segment-button>
      <ion-segment-button value="week"><ion-label>Weekly</ion-label></ion-segment-button>
      <ion-segment-button value="month"><ion-label>Monthly</ion-label></ion-segment-button>
    </ion-segment>
    <div class="card">
      <table class="t">
        @for (r of byPeriod(); track r.key) { <tr><td>{{ r.key }}</td><td class="r amount">{{ r.amount | pkr }}</td></tr> }
        @empty { <tr><td class="muted">No expenses in range.</td></tr> }
      </table>
    </div>

    <div class="section"><h2>{{ captain() ? 'Members' : 'My summary' }}</h2></div>
    <div class="card" style="overflow-x:auto">
      <table class="t">
        <tr><th>Member</th><th class="r">Deposited</th><th class="r">Spent</th><th class="r">Balance*</th></tr>
        @for (r of byMember(); track r.id) {
          <tr><td>{{ r.name }}</td><td class="r amount">{{ r.deposits | pkr }}</td><td class="r amount">{{ r.spent | pkr }}</td>
            <td class="r amount" [class.neg]="r.balance < 0">{{ r.balance | pkr }}</td></tr>
        }
      </table>
      <p class="muted" style="font-size:12px; margin:8px 0 0">*Current balance (all time). Negative balance = outstanding.</p>
    </div>

    <div class="section"><h2>Events</h2></div>
    <div class="card">
      <table class="t">
        <tr><th>Event</th><th class="r">Total</th><th class="r">People</th></tr>
        @for (e of events(); track e.id) { <tr><td>{{ e.title }}<br><small class="muted">{{ e.category }} · {{ e.date | date: 'mediumDate' }}</small></td><td class="r amount">{{ e.total | pkr }}</td><td class="r">{{ e.lines.length }}</td></tr> }
        @empty { <tr><td class="muted">No events in range.</td></tr> }
      </table>
    </div>
  </div>
  </ion-content>`,
})
export class ReportsPage {
  private store = inject(Store);
  groupId = param('groupId');
  from = signal(new Date(Date.now() - 30 * 864e5).toLocaleDateString('en-CA'));
  to = signal(new Date().toLocaleDateString('en-CA'));
  period = signal<Period>('week');

  viewAs = computed(() => this.store.viewAs()[this.groupId()]);
  captain = computed(() => !this.viewAs());
  private inRange = (d: string) => (!this.from() || d >= this.from()) && (!this.to() || d <= this.to());
  allTx = computed(() => this.store.state().txs.filter(t => t.groupId === this.groupId()));
  txs = computed(() => this.allTx().filter(t => this.inRange(t.date) && (this.captain() || t.memberId === this.viewAs())));
  t = computed(() => totals(this.txs(), this.allTx()));
  byPeriod = computed(() => {
    const rev = new Set(this.allTx().filter(t => t.reversesId).map(t => t.reversesId));
    const m = new Map<string, number>();
    for (const t of this.txs()) if ((t.type === 'expense' || t.type === 'charge') && !rev.has(t.id)) {
      const k = bucket(t.date, this.period()); m.set(k, (m.get(k) ?? 0) - t.delta);
    }
    return [...m].sort((a, b) => b[0].localeCompare(a[0])).map(([key, amount]) => ({ key, amount }));
  });
  byMember = computed(() => {
    const bal = balances(this.store.state(), this.groupId());
    return this.store.state().members.filter(m => m.groupId === this.groupId() && (this.captain() || m.id === this.viewAs())).map(m => {
      const t = totals(this.txs().filter(x => x.memberId === m.id), this.allTx());
      return { id: m.id, name: m.name, deposits: t.deposits, spent: t.expenses + t.charges, balance: bal.get(m.id) ?? 0 };
    });
  });
  events = computed(() => this.store.state().events.filter(e => e.groupId === this.groupId() && e.status === 'posted' && this.inRange(e.date)
    && (this.captain() || e.lines.some(l => l.memberId === this.viewAs()))).sort((a, b) => b.date.localeCompare(a.date)));

  /** CSV opens directly in Excel. */
  csv() {
    const names = new Map(this.store.state().members.map(m => [m.id, m.name]));
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [['Date', 'Member', 'Type', 'Description', 'Amount (PKR)', 'Transaction ID', 'Event ID', 'Reverses', 'Created by', 'Created at'],
      ...this.txs().map(t => [t.date, names.get(t.memberId) ?? '', TX_LABEL[t.type], t.description, (t.delta / 100).toFixed(2), t.id, t.eventId ?? '', t.reversesId ?? '', t.createdBy, t.createdAt])];
    const blob = new Blob(['﻿' + rows.map(r => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `transactions_${this.from()}_${this.to()}.csv` });
    a.click();
    URL.revokeObjectURL(a.href);
  }
  // ponytail: browser print-to-PDF; native file sharing via Capacitor when packaged.
  print() { window.print(); }
}
