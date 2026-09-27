# Forms — Ionic Angular v8 (standalone)

Ionic form components (`ion-input`, `ion-textarea`, `ion-select`, `ion-checkbox`, `ion-toggle`, `ion-radio`/`ion-radio-group`, `ion-range`, `ion-datetime`, `ion-searchbar`) implement `ControlValueAccessor`, so they work natively with both Angular forms APIs.

**Rule:** add the Angular forms module you use to `imports: []` alongside the Ion components — `FormsModule` for `ngModel`, `ReactiveFormsModule` for reactive forms.

## Template-driven (`ngModel`)

```ts
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
// imports: [FormsModule, IonInput, IonItem, IonList]
export class ExampleComponent {
  name = '';
}
```

```html
<ion-input label="Name" [(ngModel)]="name"></ion-input>
```

## Reactive forms

```ts
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-example',
  imports: [IonSelect, IonSelectOption, IonButton, ReactiveFormsModule],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  myForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      favFruit: ['', Validators.required],
    });
  }
  onSubmit() {
    this.myForm.get('favFruit')!.markAsTouched(); // trigger error UI
  }
}
```

```html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <ion-select formControlName="favFruit" label="Favorite fruit" labelPlacement="floating">
    <ion-select-option value="apple">Apple</ion-select-option>
    <ion-select-option value="banana">Banana</ion-select-option>
  </ion-select>
  <ion-button type="submit">Submit</ion-button>
</form>
```

## Helper / error text

`ion-input`, `ion-textarea`, `ion-select` expose `helperText` and `errorText` props. The error text is shown automatically when the control is invalid + touched (`.ion-touched.ion-invalid`). Confirm exact prop names per component in `references/components/<slug>.md`.

## Notes

- Use `[(ngModel)]` only with `FormsModule`; never mix `formControlName` and `ngModel` on the same control.
- `ion-select` options are `ion-select-option` (also a standalone import).
- For input masking, the docs use `@maskito/angular` (`MaskitoDirective`) — not an Ionic API.
