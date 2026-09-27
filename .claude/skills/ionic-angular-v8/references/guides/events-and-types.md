# Event handling & types — Ionic Angular v8

Ionic events are **`CustomEvent`s**. Ionic ships a typed wrapper per component, `Ion<Name>CustomEvent<T>`, where `T` is the event detail. Always type handlers with these — never `any` or a bare `Event`.

```ts
IonInputCustomEvent<T> extends CustomEvent<T>  // T = the detail payload
```

Import both the wrapper and the detail type from `@ionic/angular/standalone`:

```ts
import { IonInput, IonInputCustomEvent, InputChangeEventDetail } from '@ionic/angular/standalone';

onChange(ev: IonInputCustomEvent<InputChangeEventDetail>) {
  const value = ev.detail.value; // fully typed
}
```

```html
<ion-input (ionChange)="onChange($event)"></ion-input>
```

## Common form controls

| Component | Event | Handler type |
|-----------|-------|--------------|
| `ion-input` | `ionInput` / `ionChange` | `IonInputCustomEvent<InputInputEventDetail \| InputChangeEventDetail>` |
| `ion-textarea` | `ionChange` | `IonTextareaCustomEvent<TextareaChangeEventDetail>` |
| `ion-checkbox` | `ionChange` | `IonCheckboxCustomEvent<CheckboxChangeEventDetail>` |
| `ion-toggle` | `ionChange` | `IonToggleCustomEvent<ToggleChangeEventDetail>` |
| `ion-radio-group` | `ionChange` | `IonRadioGroupCustomEvent<RadioGroupChangeEventDetail>` |
| `ion-select` | `ionChange` | `IonSelectCustomEvent<SelectChangeEventDetail>` |
| `ion-range` | `ionChange` | `IonRangeCustomEvent<RangeChangeEventDetail>` |
| `ion-datetime` | `ionChange` | `IonDatetimeCustomEvent<DatetimeChangeEventDetail>` |
| `ion-searchbar` | `ionInput` / `ionChange` | `IonSearchbarCustomEvent<SearchbarInputEventDetail \| SearchbarChangeEventDetail>` |
| `ion-segment` | `ionChange` | `IonSegmentCustomEvent<SegmentChangeEventDetail>` |
| `ion-accordion-group` | `ionChange` | `IonAccordionGroupCustomEvent<AccordionGroupChangeEventDetail>` |

## Other typed events

`ion-infinite-scroll` → `IonInfiniteScrollCustomEvent`; `ion-refresher` → `IonRefresherCustomEvent<RefresherEventDetail>`; `ion-reorder-group` → `IonItemReorderCustomEvent<ItemReorderEventDetail>` (call `ev.detail.complete()`); `ion-menu` → `IonMenuCustomEvent`; `ion-tabs` → `IonTabsCustomEvent`; `ion-input-otp` → `IonInputOtpCustomEvent<InputOtpCompleteEventDetail>`.

## Rules

- Wrapper name is always `Ion<PascalTag>CustomEvent`. Detail type names are exported (e.g. `<Name>ChangeEventDetail`). Confirm the exact event name in `references/components/<slug>.md` "Events" (its `Detail` column shows the payload).
- `ionChange` fires on committed value change; `ionInput` fires on every keystroke (inputs/searchbar/textarea). Use the detail type that matches.
- Prefer `[(ngModel)]` / reactive forms (`forms.md`) for value binding; use typed `(ionChange)`/`(ionInput)` for side effects.
- The detail of overlay/lifecycle events (e.g. `didDismiss`) is typed via `OverlayEventDetail<T>` — read the controller result with `const { data, role } = await overlay.onDidDismiss()`.
