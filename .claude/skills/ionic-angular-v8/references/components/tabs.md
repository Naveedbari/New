# ion-tabs

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonTabs } from '@ionic/angular/standalone';
```

Add `IonTabs` to the component's `imports: []` array.

## Properties

_None._

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionTabsDidChange` | `{ tab: string; }` | Emitted when the navigation has finished transitioning to a new component. |
| `ionTabsWillChange` | `{ tab: string; }` | Emitted when the navigation is about to transition to a new component. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getSelected` | `getSelected() => Promise<string \| undefined>` | Get the currently selected tab. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router. |
| `getTab` | `getTab(tab: string \| HTMLIonTabElement) => Promise<HTMLIonTabElement \| undefined>` | Get a specific tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router. |
| `select` | `select(tab: string \| HTMLIonTabElement) => Promise<boolean>` | Select a tab by the value of its `tab` property or an element reference. This method is only available for vanilla JavaScript projects. The Angular, React, and Vue implementations of tabs are coupled to each framework's router. |

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `bottom` | Content is placed at the bottom of the screen. |
| `top` | Content is placed at the top of the screen. |

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
