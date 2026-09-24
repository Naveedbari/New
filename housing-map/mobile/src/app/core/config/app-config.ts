import { InjectionToken } from '@angular/core';

import { Environment } from '../../../environments/environment.model';

export type AppConfig = Environment;

/** Runtime configuration. Provided from the build-time environment file in app.config.ts. */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
