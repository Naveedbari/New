import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  add, addCircleOutline, arrowDownCircle, arrowUpCircle, barChartOutline, calendarOutline, cashOutline,
  checkmarkCircle, chevronForward, createOutline, downloadOutline, eyeOutline, peopleOutline, personAddOutline,
  receiptOutline, refreshOutline, settingsOutline, swapHorizontalOutline, trashOutline, walletOutline, warning,
  alertCircle, closeCircle, tennisballOutline, restaurantOutline, airplaneOutline, carOutline, footballOutline, pricetagOutline, ellipsisHorizontalCircleOutline,
} from 'ionicons/icons';
import { formatPKR, TX_LABEL, TxType } from './finance';

addIcons({
  add, addCircleOutline, arrowDownCircle, arrowUpCircle, barChartOutline, calendarOutline, cashOutline,
  checkmarkCircle, chevronForward, createOutline, downloadOutline, eyeOutline, peopleOutline, personAddOutline,
  receiptOutline, refreshOutline, settingsOutline, swapHorizontalOutline, trashOutline, walletOutline, warning,
  alertCircle, closeCircle, tennisballOutline, restaurantOutline, airplaneOutline, carOutline, footballOutline, pricetagOutline, ellipsisHorizontalCircleOutline,
});

@Pipe({ name: 'pkr' })
export class PkrPipe implements PipeTransform { transform = formatPKR; }

@Pipe({ name: 'txLabel' })
export class TxLabelPipe implements PipeTransform { transform = (t: TxType) => TX_LABEL[t]; }

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local

export const CATEGORY_ICON: Record<string, string> = {
  'Indoor Cricket': 'tennisball-outline', 'Outdoor Sports': 'football-outline', Dinner: 'restaurant-outline',
  'Trip / Vacation': 'airplane-outline', Outing: 'car-outline', 'General Expense': 'pricetag-outline', Other: 'ellipsis-horizontal-circle-outline',
};

export const initials = (name: string) => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

/** Route param as a getter. Ionic creates a new page per navigation, so the snapshot is stable. */
export function param(name: string): () => string {
  const r = inject(ActivatedRoute).snapshot;
  const v = r.paramMap.get(name) ?? r.queryParamMap.get(name) ?? '';
  return () => v;
}
