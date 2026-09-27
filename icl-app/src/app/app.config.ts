import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';
import { AuthService } from './core/auth.service';
import { DatabaseService } from './core/database.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md' }),
    // Hash URLs keep deep links working on static hosting (a reload never hits the server path).
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    provideAppInitializer(async () => {
      const db = inject(DatabaseService);
      const auth = inject(AuthService);
      await db.init();
      await auth.load();
    }),
  ],
};
