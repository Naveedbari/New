import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { balances, formatPKR, recordTx, toPaisa, TX_LABEL } from '../core/finance';
import { today, param } from '../core/ui';

type MoneyType = 'deposit' | 'refund' | 'credit_adj' | 'debit_adj';

@Component({
  selector: 'app-money',
  imports: [FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSegment, IonSegmentButton, IonLabel],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>{{ label[kind] }}</ion-title>
  </ion-toolbar></ion-header>
  <ion-content>
  <div class="wrap" style="padding-top:8px">
    <ion-segment [(ngModel)]="kind" style="margin:0 16px 16px; width:auto">
      <ion-segment-button value="deposit"><ion-label>Deposit</ion-label></ion-segment-button>
      <ion-segment-button value="refund"><ion-label>Refund</ion-label></ion-segment-button>
      <ion-segment-button value="credit_adj"><ion-label>Credit</ion-label></ion-segment-button>
      <ion-segment-button value="debit_adj"><ion-label>Debit</ion-label></ion-segment-button>
    </ion-segment>
    <ion-list class="inset">
      <ion-item>
        <ion-select label="Member" labelPlacement="stacked" interface="action-sheet" placeholder="Select member" [(ngModel)]="memberId">
          @for (m of members(); track m.id) { <ion-select-option [value]="m.id">{{ m.name }} ({{ fmt(bal().get(m.id) ?? 0) }})</ion-select-option> }
        </ion-select>
      </ion-item>
      <ion-item><ion-input label="Amount (PKR)" labelPlacement="stacked" inputmode="decimal" placeholder="0" [(ngModel)]="amount"></ion-input></ion-item>
      <ion-item><ion-input label="Date" labelPlacement="stacked" type="date" [(ngModel)]="date"></ion-input></ion-item>
      @if (kind === 'deposit' || kind === 'refund') {
        <ion-item>
          <ion-select label="Payment method" labelPlacement="stacked" interface="popover" [(ngModel)]="method">
            @for (p of methods; track p) { <ion-select-option [value]="p">{{ p }}</ion-select-option> }
          </ion-select>
        </ion-item>
      }
      <ion-item><ion-textarea [label]="kind.endsWith('adj') ? 'Reason (required)' : 'Note (optional)'" labelPlacement="stacked" autoGrow [(ngModel)]="note"></ion-textarea></ion-item>
    </ion-list>
    @if (kind === 'refund') { <p class="muted ion-padding-horizontal" style="font-size:13px">A refund records money paid back to the member's group balance (e.g. an overcharge returned).</p> }
    <div class="ion-padding-horizontal"><ion-button expand="block" [disabled]="busy" (click)="save()">Save {{ label[kind].toLowerCase() }}</ion-button></div>
  </div>
  </ion-content>`,
})
export class MoneyPage {
  private store = inject(Store);
  private nav = inject(NavController);
  groupId = param('groupId');
  member = param('member');
  type = param('type') as () => MoneyType | '';
  label = TX_LABEL;
  methods = ['Cash', 'Bank transfer', 'JazzCash', 'Easypaisa', 'Other'];
  kind: MoneyType = 'deposit';
  memberId = '';
  amount = '';
  date = today();
  method = 'Cash';
  note = '';
  busy = false;
  fmt = formatPKR;
  members = computed(() => this.store.state().members.filter(m => m.groupId === this.groupId() && m.active));
  bal = computed(() => balances(this.store.state(), this.groupId()));

  ngOnInit() { this.memberId = this.member(); this.kind = this.type() || 'deposit'; }

  save() {
    if (!this.memberId) { this.store.say('Select a member.', 'danger'); return; }
    let amount: number;
    try { amount = toPaisa(this.amount); } catch (e) { { this.store.say((e as Error).message, 'danger'); return; } }
    this.busy = true;
    const ok = this.store.run(s => recordTx(s, this.kind, {
      groupId: this.groupId(), memberId: this.memberId, amount, date: this.date, description: this.note,
      method: this.kind === 'deposit' || this.kind === 'refund' ? this.method : undefined, by: this.store.user,
    }), `${TX_LABEL[this.kind]} of ${formatPKR(amount)} recorded`);
    if (ok) this.nav.back(); else this.busy = false;
  }
}
