import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { fileTrayOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="state">
      <ion-icon name="file-tray-outline" color="medium" aria-hidden="true" />
      <p>{{ message() }}</p>
    </div>
  `,
  styleUrl: './state.scss',
})
export class EmptyStateComponent {
  readonly message = input.required<string>();

  constructor() {
    addIcons({ fileTrayOutline });
  }
}
