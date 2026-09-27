# Config (IonicConfig) — Ionic Angular v8

Global config is passed as an object to `provideIonicAngular({...})` in `main.ts` (see `setup.md`). It must be called even with no config. Values are typed by `IonicConfig`.

```ts
provideIonicAngular({
  mode: 'ios',
  rippleEffect: false,
  animated: true,
  swipeBackEnabled: true,
});
```

Per-component overrides still win over global config (e.g. a component's own `mode` prop).

## Options

| Key | Type | Description |
|-----|------|-------------|
| `mode` | `'ios' \| 'md'` | Platform styles for the whole app. |
| `animated` | `boolean` | Enable all animations/transitions app-wide. |
| `rippleEffect` | `boolean` | Enable Material ripple effects app-wide. |
| `hardwareBackButton` | `boolean` | Respond to the Android hardware back button. |
| `swipeBackEnabled` | `boolean` | Enable iOS swipe-to-go-back gesture. |
| `statusTap` | `boolean` | Tap status bar scrolls content to top. |
| `sanitizerEnabled` | `boolean` | Basic DOM sanitizer on props that accept HTML. |
| `innerHTMLTemplatesEnabled` | `boolean` | Parse content as HTML in alert/loading/toast/infinite-scroll/refresher (default `false`). |
| `logLevel` | `'OFF' \| 'ERROR' \| 'WARN'` | Framework logging level. |
| `mode` (per platform) | `PlatformConfig` via `platform` | `platform` overrides platform-detection methods. |
| `spinner` | `SpinnerTypes` | Default `ion-spinner` type. |
| `loadingSpinner` | `SpinnerTypes` | Default spinner for `ion-loading`. |
| `infiniteLoadingSpinner` | `SpinnerTypes` | Default spinner for `ion-infinite-scroll-content`. |
| `refreshingSpinner` | `SpinnerTypes` | Default spinner for refresher content. |
| `loadingSpinner`/`refreshingIcon`/`menuIcon`/`backButtonIcon` | `string` | Override default icons. |
| `backButtonText` | `string` | Default text for all `ion-back-button`. |
| `backButtonDefaultHref` | `string` | Default `defaultHref` for all `ion-back-button`. |
| `menuType` | `string` | Default menu type for all `ion-menu`. |
| `tabButtonLayout` | `TabButtonLayout` | Default layout for tab buttons. |
| `toastDuration` | `number` | Default `duration` for all `ion-toast`. |
| `toggleOnOffLabels` | `boolean` | Default on/off labels for all `ion-toggle`. |

### Custom overlay animations

Each overlay has `…Enter` / `…Leave` keys typed `AnimationBuilder` to override default present/dismiss animations app-wide: `actionSheetEnter`/`Leave`, `alertEnter`/`Leave`, `loadingEnter`/`Leave`, `modalEnter`/`Leave`, `pickerEnter`/`Leave`, `popoverEnter`/`Leave`, `toastEnter`/`Leave`. Plus `navAnimation` (`AnimationBuilder`) for `ion-nav`/`ion-router-outlet` transitions.

### Experimental

| Key | Type | Description |
|-----|------|-------------|
| `experimentalCloseWatcher` | `boolean` | Use the CloseWatcher API for Escape/back dismissal. Requires `hardwareBackButton: true`. |
| `focusManagerPriority` | `FocusManagerPriority[]` | Move focus after page transitions (a11y). Off by default. |

## Per-platform config

Pass a function to set config conditionally by platform:

```ts
provideIonicAngular({
  mode: isPlatform('ios') ? 'ios' : 'md',
});
```

`isPlatform` / `getPlatforms` are imported from `@ionic/angular/standalone`.
