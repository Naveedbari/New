import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';
import { SystemInfo } from './system-info.model';

@Injectable({ providedIn: 'root' })
export class SystemApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getInfo(): Observable<SystemInfo> {
    return this.http.get<SystemInfo>(`${this.config.apiBaseUrl}/api/v1/system/info`);
  }
}
