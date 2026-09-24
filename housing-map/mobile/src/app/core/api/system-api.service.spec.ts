import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';
import { SystemApiService } from './system-api.service';
import { SystemInfo } from './system-info.model';

describe('SystemApiService', () => {
  let http: HttpTestingController;
  let service: SystemApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { name: 'development', apiBaseUrl: 'http://api.test' } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SystemApiService);
  });

  afterEach(() => http.verify());

  it('requests the versioned system info endpoint on the configured API', async () => {
    const response: SystemInfo = {
      apiVersion: '1',
      environment: 'Development',
      activeDataset: null,
    };

    const result = firstValueFrom(service.getInfo());
    http.expectOne('http://api.test/api/v1/system/info').flush(response);

    expect(await result).toEqual(response);
  });
});
