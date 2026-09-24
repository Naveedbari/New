import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-error-state',
  imports: [IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="state" role="alert">
      <ion-icon name="alert-circle-outline" color="danger" aria-hidden="true" />
      <p>{{ message() }}</p>
      @if (retryable()) {
        <ion-button fill="outline" (click)="retry.emit()">Try again</ion-button>
      }
    </div>
  `,
  styleUrl: './state.scss',
})
export class ErrorStateComponent {
  readonly message = input.required<string>();
  readonly retryable = input(true);
  readonly retry = output();

  constructor() {
    addIcons({ alertCircleOutline });
  }
}
