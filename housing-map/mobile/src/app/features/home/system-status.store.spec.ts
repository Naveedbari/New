import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { SystemApiService } from '../../core/api/system-api.service';
import { SystemInfo } from '../../core/api/system-info.model';
import { SystemStatusStore } from './system-status.store';

const INFO: SystemInfo = {
  apiVersion: '1',
  environment: 'Development',
  activeDataset: {
    version: 'dev-sample-0.1',
    name: 'Development sample scheme (synthetic)',
    crs: 'EPSG:4326',
    isDevelopmentData: true,
    publishedAt: null,
    featureCounts: {
      sectors: 2,
      blocks: 4,
      streets: 12,
      roads: 3,
      plots: 120,
      pointsOfInterest: 4,
    },
  },
};

function createStore(getInfo: () => Observable<SystemInfo>): SystemStatusStore {
  TestBed.configureTestingModule({
    providers: [SystemStatusStore, { provide: SystemApiService, useValue: { getInfo } }],
  });
  return TestBed.inject(SystemStatusStore);
}

describe('SystemStatusStore', () => {
  it('starts in the loading state', () => {
    const store = createStore(() => of(INFO));

    expect(store.status().state).toBe('loading');
  });

  it('exposes system info when the API responds', async () => {
    const store = createStore(() => of(INFO));

    await store.load();

    expect(store.status()).toEqual({ state: 'ready', info: INFO });
  });

  it('exposes a friendly error when the API fails', async () => {
    const store = createStore(() => throwError(() => new HttpErrorResponse({ status: 503 })));

    await store.load();

    const status = store.status();
    expect(status.state).toBe('error');
    expect(status.state === 'error' && status.error.kind).toBe('server-unavailable');
  });

  it('recovers on retry', async () => {
    let fail = true;
    const store = createStore(() =>
      fail ? throwError(() => new HttpErrorResponse({ status: 0 })) : of(INFO),
    );

    await store.load();
    fail = false;
    await store.load();

    expect(store.status().state).toBe('ready');
  });
});
