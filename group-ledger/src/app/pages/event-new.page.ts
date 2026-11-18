import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController, NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonLabel, IonNote, IonIcon, IonSegment, IonSegmentButton, IonToggle, IonFooter,
} from '@ionic/angular/standalone';
import { Store } from '../core/store';
import { CATEGORIES, Distribution, ParticipantInput, balances, distribute, formatPKR, postEvent, shortfalls, toBp, toPaisa } from '../core/finance';
import { PkrPipe, today, param } from '../core/ui';

interface Draft { kind: 'equal' | 'percent' | 'fixed'; value: string; extraFixed: string; extraPct: string; reason: string }
const blank = (): Draft => ({ kind: 'equal', value: '', extraFixed: '', extraPct: '', reason: '' });

@Component({
  selector: 'app-event-new',
  imports: [FormsModule, PkrPipe, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonLabel, IonNote, IonIcon, IonSegment, IonSegmentButton, IonToggle, IonFooter],
  template: `
  <ion-header><ion-toolbar>
    <ion-buttons slot="start"><ion-back-button [defaultHref]="'/g/' + groupId()" text=""></ion-back-button></ion-buttons>
    <ion-title>New expense event</ion-title>
  </ion-toolbar></ion-header>
  <ion-content>
  <div class="wrap" style="padding-top:8px">
    <div class="section"><h2>1 · Details</h2></div>
    <ion-list class="inset">
      <ion-item><ion-input label="Title" labelPlacement="stacked" placeholder="e.g. Weekend Cricket" [(ngModel)]="title"></ion-input></ion-item>
      <ion-item>
        <ion-select label="Category" labelPlacement="stacked" interface="action-sheet" [(ngModel)]="category">
          @for (c of categories; track c) { <ion-select-option [value]="c">{{ c }}</ion-select-option> }
        </ion-select>
      </ion-item>
      <ion-item><ion-input label="Date" labelPlacement="stacked" type="date" [(ngModel)]="date"></ion-input></ion-item>
      <ion-item><ion-toggle [(ngModel)]="useRate">Calculate from rate × hours</ion-toggle></ion-item>
      @if (useRate) {
        <ion-item><ion-input label="Hourly rate (PKR)" labelPlacement="stacked" inputmode="decimal" placeholder="1400" [(ngModel)]="rate"></ion-input></ion-item>
        <ion-item><ion-input label="Hours" labelPlacement="stacked" inputmode="decimal" placeholder="2" [(ngModel)]="hours"></ion-input></ion-item>
        <ion-item><ion-label>Total expense</ion-label><ion-note slot="end" class="amount">{{ total() ?? 0 | pkr }}</ion-note></ion-item>
      } @else {
        <ion-item><ion-input label="Total expense (PKR)" labelPlacement="stacked" inputmode="decimal" placeholder="0" [(ngModel)]="amount"></ion-input></ion-item>
      }
      <ion-item><ion-textarea label="Description (optional)" labelPlacement="stacked" autoGrow [(ngModel)]="description"></ion-textarea></ion-item>
    </ion-list>

    <div class="section">
      <h2>2 · Participants ({{ selectedIds().length }}/{{ members().length }})</h2>
      <ion-button fill="clear" size="small" (click)="toggleAll()">{{ selectedIds().length === members().length ? 'Clear' : 'Select all' }}</ion-button>
    </div>
    <ion-list class="inset">
      @for (m of members(); track m.id) {
        <ion-item lines="full">
          <ion-checkbox slot="start" [checked]="!!drafts[m.id]" (ionChange)="toggle(m.id)" [attr.aria-label]="m.name"></ion-checkbox>
          <ion-label (click)="toggle(m.id)">{{ m.name }}<p>Balance {{ bal().get(m.id) ?? 0 | pkr }}</p></ion-label>
          @if (drafts[m.id]) {
            <ion-button slot="end" fill="clear" size="small" (click)="open = open === m.id ? '' : m.id">
              {{ line(m.id)?.total ?? 0 | pkr }}<ion-icon slot="end" name="create-outline"></ion-icon>
            </ion-button>
          }
        </ion-item>
        @if (drafts[m.id] && open === m.id) {
          <div style="padding:12px 16px; background:rgba(var(--ion-color-primary-rgb),.05)">
            <ion-segment [(ngModel)]="drafts[m.id].kind" (ionChange)="tick()">
              <ion-segment-button value="equal">Equal</ion-segment-button>
              <ion-segment-button value="percent">%</ion-segment-button>
              <ion-segment-button value="fixed">Fixed</ion-segment-button>
            </ion-segment>
            @if (drafts[m.id].kind !== 'equal') {
              <ion-input fill="outline" [label]="drafts[m.id].kind === 'percent' ? 'Share of total (%)' : 'Fixed share (PKR)'" labelPlacement="stacked" inputmode="decimal" [(ngModel)]="drafts[m.id].value" (ionInput)="tick()" style="margin-top:10px"></ion-input>
            }
            <div style="display:flex; gap:8px; margin-top:10px">
              <ion-input fill="outline" label="Extra charge (PKR)" labelPlacement="stacked" inputmode="decimal" [(ngModel)]="drafts[m.id].extraFixed" (ionInput)="tick()"></ion-input>
              <ion-input fill="outline" label="Extra (% of share)" labelPlacement="stacked" inputmode="decimal" [(ngModel)]="drafts[m.id].extraPct" (ionInput)="tick()"></ion-input>
            </div>
            @if (drafts[m.id].extraFixed || drafts[m.id].extraPct) {
              <ion-input fill="outline" label="Reason (e.g. late arrival)" labelPlacement="stacked" [(ngModel)]="drafts[m.id].reason" style="margin-top:10px"></ion-input>
            }
          </div>
        }
      } @empty { <ion-item><ion-label class="muted">No active members — add members first.</ion-label></ion-item> }
    </ion-list>
    <p class="muted ion-padding-horizontal" style="font-size:12px; margin-top:-8px">Tap an amount to set a percentage, fixed share or extra charge. Everyone left on "Equal" splits whatever remains.</p>

    <div class="section"><h2>3 · Preview</h2></div>
    @for (e of preview().errors; track e) { <div class="banner err"><ion-icon name="close-circle"></ion-icon>{{ e }}</div> }
    @if (preview().lines.length) {
      <div class="card">
        <table class="t">
          <tr><th>Member</th><th class="r">Share</th><th class="r">Extra</th><th class="r">Total</th></tr>
          @for (l of preview().lines; track l.memberId) {
            <tr>
              <td>{{ name(l.memberId) }}<br><small class="muted">{{ ruleText(l.rule) }}{{ l.extraReason ? ' · ' + l.extraReason : '' }}</small></td>
              <td class="r amount">{{ l.base | pkr }}</td>
              <td class="r amount">{{ l.extra ? (l.extra | pkr) : '—' }}</td>
              <td class="r amount">{{ l.total | pkr }}</td>
            </tr>
          }
          <tr><th>Total</th><th class="r amount">{{ baseSum() | pkr }}</th><th class="r amount">{{ extraSum() | pkr }}</th><th class="r amount">{{ baseSum() + extraSum() | pkr }}</th></tr>
        </table>
        <p class="muted" style="font-size:12px; margin:8px 0 0"><ion-icon name="checkmark-circle" color="success"></ion-icon> Shares reconcile with the event total of {{ total() ?? 0 | pkr }}. {{ members().length - selectedIds().length }} non-participants are not charged.</p>
      </div>
      @if (short().length) {
        <div class="banner warn" style="display:block">
          <b><ion-icon name="warning"></ion-icon> Insufficient balance</b>
          @for (x of short(); track x.memberId) { <div>{{ name(x.memberId) }}: needs {{ x.required | pkr }}, has {{ x.available | pkr }} → outstanding {{ x.required - x.available | pkr }}</div> }
        </div>
        @if (allowOverdraft()) {
          <ion-list class="inset"><ion-item><ion-checkbox [(ngModel)]="allowOutstanding" justify="space-between">Record shortfall as outstanding</ion-checkbox></ion-item></ion-list>
        } @else {
          <div class="banner err">Outstanding balances are disabled in group settings. Record deposits first.</div>
        }
      }
    }
  </div>
  </ion-content>
  <ion-footer><div class="sticky-foot"><div class="wrap">
    <ion-button expand="block" [disabled]="busy || !canSave()" (click)="confirm()">Confirm & deduct {{ (baseSum() + extraSum()) | pkr }}</ion-button>
  </div></div></ion-footer>`,
})
export class EventNewPage {
  private store = inject(Store);
  private nav = inject(NavController);
  private alerts = inject(AlertController);
  groupId = param('groupId');
  readonly id = crypto.randomUUID(); // idempotency key: re-submitting this form can't post twice
  categories = CATEGORIES;
  title = ''; category = 'Indoor Cricket'; date = today(); description = '';
  useRate = false; rate = ''; hours = ''; amount = '';
  drafts: Record<string, Draft> = {};
  open = '';
  allowOutstanding = false;
  busy = false;

  members = computed(() => this.store.state().members.filter(m => m.groupId === this.groupId() && m.active).sort((a, b) => a.name.localeCompare(b.name)));
  bal = computed(() => balances(this.store.state(), this.groupId()));
  allowOverdraft = computed(() => this.store.group(this.groupId)()?.settings.allowOverdraft ?? false);

  // Plain getters recomputed on change detection; member lists are small.
  selectedIds = () => this.members().filter(m => this.drafts[m.id]).map(m => m.id);
  total(): number | null {
    try {
      if (!this.useRate) return toPaisa(this.amount);
      // rate (paisa) × hours with up to 2 decimals, rounded to the nearest paisa
      return Math.round((toPaisa(this.rate) * toPaisa(this.hours)) / 100);
    } catch { return null; }
  }
  private cache?: { key: string; d: Distribution };
  preview(): Distribution {
    const key = JSON.stringify([this.total(), this.drafts]);
    if (this.cache?.key === key) return this.cache.d;
    const d = this.compute();
    this.cache = { key, d };
    return d;
  }
  private compute(): Distribution {
    const total = this.total();
    if (total === null) return { lines: [], errors: [this.useRate ? 'Enter a valid rate and hours.' : 'Enter a valid total amount.'] };
    try {
      const parts: ParticipantInput[] = this.selectedIds().map(id => {
        const d = this.drafts[id];
        const opt = (v: string, f: (x: string) => number) => (v.trim() ? f(v) : 0);
        return {
          memberId: id,
          rule: d.kind === 'equal' ? { kind: 'equal' } : d.kind === 'percent' ? { kind: 'percent', bp: toBp(d.value || '0') } : { kind: 'fixed', amount: toPaisa(d.value || '0') },
          extraFixed: opt(d.extraFixed, toPaisa), extraBp: opt(d.extraPct, toBp), extraReason: d.reason,
        };
      });
      return distribute(total, parts);
    } catch (e) { return { lines: [], errors: [(e as Error).message] }; }
  }
  line = (id: string) => this.preview().lines.find(l => l.memberId === id);
  baseSum = () => this.preview().lines.reduce((s, l) => s + l.base, 0);
  extraSum = () => this.preview().lines.reduce((s, l) => s + l.extra, 0);
  short = () => shortfalls(this.store.state(), this.groupId(), this.preview().lines);
  canSave = () => !!this.title.trim() && !this.preview().errors.length && this.preview().lines.length > 0 && (!this.short().length || (this.allowOutstanding && this.allowOverdraft()));

  name = (id: string) => this.store.state().members.find(m => m.id === id)?.name ?? '';
  ruleText(r: ParticipantInput['rule']) { return r.kind === 'equal' ? 'Equal split' : r.kind === 'percent' ? `${r.bp / 100}% of total` : 'Fixed amount'; }
  tick() { this.cache = undefined; }
  toggle(id: string) { if (this.drafts[id]) { delete this.drafts[id]; if (this.open === id) this.open = ''; } else this.drafts[id] = blank(); this.tick(); }
  toggleAll() {
    const all = this.selectedIds().length === this.members().length;
    this.drafts = all ? {} : Object.fromEntries(this.members().map(m => [m.id, this.drafts[m.id] ?? blank()]));
    this.tick();
  }

  async confirm() {
    const a = await this.alerts.create({
      header: 'Confirm expense',
      message: `Deduct ${formatPKR(this.baseSum() + this.extraSum())} from ${this.preview().lines.length} participant(s) for "${this.title.trim()}"?`,
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm', handler: () => this.post() }],
    });
    a.present();
  }

  private post() {
    this.busy = true;
    const total = this.total()!;
    const parts = this.preview().lines.map(l => ({ memberId: l.memberId, rule: l.rule, extraFixed: l.extra, extraReason: l.extraReason }));
    const ok = this.store.run(s => postEvent(s, {
      id: this.id, groupId: this.groupId(), title: this.title, category: this.category, date: this.date, description: this.description,
      total, participants: parts, allowOutstanding: this.allowOutstanding, by: this.store.user,
    }), 'Expense recorded and balances updated');
    if (ok) this.nav.navigateForward(['/g', this.groupId(), 'e', this.id], { replaceUrl: true }); else this.busy = false;
  }
}
