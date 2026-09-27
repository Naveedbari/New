# Navigation — Ionic Angular v8 (standalone)

Ionic Angular uses the **Angular Router** — NOT `ion-router`/`ion-route`/`ion-route-redirect` (those are for vanilla/Stencil only). `IonRouterOutlet` replaces `<router-outlet>` to get native page transitions and stack management.

## Routes (lazy standalone pages)

```ts title="app.routes.ts"
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
```

Register with `provideRouter(routes)` in `main.ts` (see `setup.md`). `IonRouterOutlet` lives in the root template inside `ion-app`.

## A page component

```ts title="home.page.ts"
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {}
```

## Navigating

- Declarative: `[routerLink]="['/detail', id]"` on any element/`ion-button`/`ion-item`.
- Programmatic: inject Angular `Router` and call `this.router.navigateByUrl('/detail')`.
- Direction/animation: Ionic components accept `routerDirection` (`"forward" | "back" | "root"`) and `routerAnimation`.

## Back button

`ion-back-button` shows a contextual back button; it needs `ion-buttons` with `slot="start"` inside the toolbar. `defaultHref` is the fallback when there is no navigation stack.

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Detail</ion-title>
  </ion-toolbar>
</ion-header>
```

## Tabs

Use `IonTabs`, `IonTabBar`, `IonTabButton` with child routes. `IonTabs` is a standalone import; tab content is routed via nested `children` in the route config. Confirm props in `references/components/tabs.md`, `tab-bar.md`, `tab-button.md`.

## Lifecycle

Ionic page lifecycle hooks (from `@ionic/angular/standalone`): implement `ViewWillEnter`, `ViewDidEnter`, `ViewWillLeave`, `ViewDidLeave` — these fire with Ionic's stack navigation where Angular's `ngOnInit`/`ngOnDestroy` may not re-run (pages are cached).
