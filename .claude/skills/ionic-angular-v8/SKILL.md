---
name: ionic-angular-v8
description: "Trigger: Ionic Angular, ion-* components, @ionic/angular/standalone, ionic v8, Ionic overlays/controllers, ionic forms/routing. Build Ionic Framework v8 apps in Angular with precise, verified component APIs."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when writing, editing, or reviewing **Ionic Framework v8 code in Angular** (standalone): `ion-*` components, `@ionic/angular/standalone` imports, overlays/controllers, forms, theming, or routing. Do not use for Ionic React/Vue, or Ionic ≤7 `IonicModule` apps.

## Hard Rules

- Target **v8 standalone only**. Import components and controllers from `@ionic/angular/standalone`. Never use `IonicModule` (that is the legacy ≤7 pattern).
- Every `ion-*` component used in a template MUST be added to the component's `imports: []` array (e.g. `imports: [IonButton]`). There is no global module.
- **Never invent a prop, event, attribute, type, or default.** Before using a component, read its reference file `references/components/<slug>.md` and copy values exactly (props, union types, defaults, events, CSS vars, slots, parts).
- Use `[property]` binding for non-string/boolean props (objects, numbers, booleans) — e.g. `[disabled]="true"`, not `disabled="true"`.
- Icons: register with `addIcons({...})` from `ionicons` in the constructor before using them in `<ion-icon name="...">`.
- `ion-router`/`ion-route`/`ion-route-redirect` do NOT apply in Angular — use the Angular Router with `IonRouterOutlet`.

## Decision Gates

| Need | Action |
|------|--------|
| Exact API of a component | Read `references/components/<slug>.md` (start from `references/index.md`) |
| Project bootstrap, `provideIonicAngular`, icons, CSS | Read `references/guides/setup.md` |
| Alert/Toast/Modal/Popover/Loading/ActionSheet/Picker | Read `references/guides/overlays.md` (controller-DI vs inline) |
| Inputs with `ngModel`/Reactive Forms | Read `references/guides/forms.md` |
| Pages, lazy routes, tabs, back button | Read `references/guides/navigation.md` |
| App colors, custom color, dark mode, modes, `::part()` | Read `references/guides/theming.md` |
| Typing `(ionChange)`/`(ionInput)` handlers, event detail | Read `references/guides/events-and-types.md` |
| `provideIonicAngular` / global IonicConfig options | Read `references/guides/config.md` |

## Execution Steps

1. Identify the `ion-*` components/controllers the task needs.
2. Open `references/index.md` → resolve each tag to its standalone import name and reference file.
3. Read each component's `references/components/<slug>.md`; use only documented props/events/types/defaults.
4. For setup/overlays/forms/routing concerns, read the matching guide above first.
5. Write code: add components to `imports: []`, inject controllers via constructor DI, bind props with verified types.

## Output Contract

- Imports come from `@ionic/angular/standalone`.
- Every used component appears in `imports: []`; every controller is constructor-injected.
- Props/events/types match the reference files exactly — no fabricated API.

## References

- `references/index.md` — all 95 components → import name, controller, reference file.
- `references/components/<slug>.md` — precise per-component API (from `@ionic/core` v8 `docs.json`).
- `references/guides/setup.md`, `overlays.md`, `forms.md`, `navigation.md`, `theming.md`, `events-and-types.md`, `config.md` — verified v8 standalone patterns.
