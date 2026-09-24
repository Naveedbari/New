import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-loading-state',
  imports: [IonSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="state" role="status" aria-live="polite">
      <ion-spinner name="crescent" aria-hidden="true" />
      <p>{{ message() }}</p>
    </div>
  `,
  styleUrl: './state.scss',
})
export class LoadingStateComponent {
  readonly message = input('Loading…');
}
