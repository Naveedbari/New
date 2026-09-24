import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError, toApiError } from '../../core/api/api-error';
import { SystemApiService } from '../../core/api/system-api.service';
import { SystemInfo } from '../../core/api/system-info.model';

export type SystemStatus =
  | { readonly state: 'loading' }
  | { readonly state: 'ready'; readonly info: SystemInfo }
  | { readonly state: 'error'; readonly error: ApiError };

/** Loads API/dataset status for the home screen and exposes it as a signal. */
@Injectable()
export class SystemStatusStore {
  private readonly api = inject(SystemApiService);
  private readonly statusSignal = signal<SystemStatus>({ state: 'loading' });

  readonly status = this.statusSignal.asReadonly();

  async load(): Promise<void> {
    this.statusSignal.set({ state: 'loading' });
    try {
      const info = await firstValueFrom(this.api.getInfo());
      this.statusSignal.set({ state: 'ready', info });
    } catch (error: unknown) {
      this.statusSignal.set({ state: 'error', error: toApiError(error, navigator.onLine) });
    }
  }
}
