# Theming — Ionic Angular v8

Two levels:
1. **Global theme** — app-wide colors, background/text, dark mode (this guide).
2. **Per-component** — each component's `--background`, `--color`, etc. → see that component's `references/components/<slug>.md` "CSS Custom Properties" table, plus `::part()` for shadow parts.

Global variables live in `src/theme/variables.scss` (imported by the Ionic starter). Component CSS vars override globals locally.

## Application colors

The 9 named colors (`primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`, `light`, `medium`, `dark`) plus app `--ion-background-color` and `--ion-text-color`. Each named color is a **set of 6 variables**:

```css
:root {
  --ion-color-secondary: #006600;
  --ion-color-secondary-rgb: 0, 102, 0;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-contrast-rgb: 255, 255, 255;
  --ion-color-secondary-shade: #005a00;
  --ion-color-secondary-tint: #1a751a;
}
```

Use the color on any Ionic component via the `color` prop: `<ion-button color="secondary">`.

> Generate the full 6-variable set with the official tool: https://ionicframework.com/docs/theming/color-generator

## Adding a custom color

1. Define the 6 variables on `:root`:

```css
:root {
  --ion-color-favorite: #69bb7b;
  --ion-color-favorite-rgb: 105, 187, 123;
  --ion-color-favorite-contrast: #ffffff;
  --ion-color-favorite-contrast-rgb: 255, 255, 255;
  --ion-color-favorite-shade: #5ca56c;
  --ion-color-favorite-tint: #78c288;
}
```

2. Register it with a class named **exactly** `.ion-color-{name}`:

```css
.ion-color-favorite {
  --ion-color-base: var(--ion-color-favorite);
  --ion-color-base-rgb: var(--ion-color-favorite-rgb);
  --ion-color-contrast: var(--ion-color-favorite-contrast);
  --ion-color-contrast-rgb: var(--ion-color-favorite-contrast-rgb);
  --ion-color-shade: var(--ion-color-favorite-shade);
  --ion-color-tint: var(--ion-color-favorite-tint);
}
```

Now `color="favorite"` works on any Ionic component.

## Stepped colors

`--ion-color-step-50` … `--ion-color-step-950` are auto-generated mixes between background and text. Ionic components use them for borders, shadows, etc. Override them to fine-tune a palette (especially for custom dark themes).

## Dark mode

Import ONE dark palette file (Angular paths). Three strategies:

| File | Behavior |
|------|----------|
| `@ionic/angular/css/palettes/dark.always.css` | Dark applied unconditionally |
| `@ionic/angular/css/palettes/dark.system.css` | Dark when OS `prefers-color-scheme: dark` |
| `@ionic/angular/css/palettes/dark.class.css` | Dark only when `.ion-palette-dark` is on `<html>` (manual toggle) |

```css
/* global.scss */
@import '@ionic/angular/css/palettes/dark.class.css';
```

Toggle (class strategy) — the class **must** be on the `<html>` element:

```ts
toggleDark(enable: boolean) {
  document.documentElement.classList.toggle('ion-palette-dark', enable);
}
```

To combine system default + manual override, read `window.matchMedia('(prefers-color-scheme: dark)')` and set the class accordingly.

## Modes (ios / md) & platform styles

Components render per **mode**: `ios` on Apple devices, `md` (Material) on Android/other. The mode adds a class (`ios`/`md`) to `<html>`. Override globally via `provideIonicAngular({ mode: 'ios' })` (see `setup.md`), or per component with the `mode` prop. Scope CSS by mode with the `.ios` / `.md` selectors — required when overriding mode-specific dark palette vars (e.g. `.ion-palette-dark.ios`).

## Theming a single component

Prefer the component's documented CSS custom properties (in its reference file) over `::part()`. Use `::part(name)` only for parts the component exposes (listed under "CSS Shadow Parts" in `references/components/<slug>.md`):

```css
ion-select::part(icon) { color: var(--ion-color-primary); opacity: 1; }
```
