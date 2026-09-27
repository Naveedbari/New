# Setup — Ionic Angular v8 (standalone)

## Bootstrap (`main.ts`)

`provideIonicAngular` MUST be called even with no config. Pair it with `IonicRouteStrategy`.

```ts title="main.ts"
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(/* { mode: 'ios' } — any IonicConfig */),
    provideRouter(routes),
  ],
});
```

## Root component

```ts title="app.component.ts"
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {}
```

```html title="app.component.html"
<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```

## Global CSS (`angular.json` styles or `global.scss`)

Required core CSS plus optional utilities:

```css
@import '@ionic/angular/css/core.css';
@import '@ionic/angular/css/normalize.css';
@import '@ionic/angular/css/structure.css';
@import '@ionic/angular/css/typography.css';
/* optional utilities */
@import '@ionic/angular/css/padding.css';
@import '@ionic/angular/css/flex-utils.css';
@import '@ionic/angular/css/display.css';
/* optional dark palette */
@import '@ionic/angular/css/palettes/dark.system.css';
```

## Icons (ionicons)

Register icons once (constructor) before referencing them by name. Do NOT import the whole icon set.

```ts
import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, logoIonic } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [IonIcon],
})
export class HomePage {
  constructor() {
    addIcons({ heart, logoIonic });
  }
}
```

```html
<ion-icon name="heart"></ion-icon>
```

## Config

Any `IonicConfig` value (e.g. `mode`, `animated`, `rippleEffect`) is passed as an object to `provideIonicAngular({...})`.
