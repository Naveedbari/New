# ion-ripple-effect

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonRippleEffect } from '@ionic/angular/standalone';
```

Add `IonRippleEffect` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | `type` | `"bounded" \| "unbounded"` | `'bounded'` | Sets the type of ripple-effect:  - `bounded`: the ripple effect expands from the user's click position - `unbounded`: the ripple effect expands from the center of the button and overflows the container.  NOTE: Surfaces for bounded ripples should have the overflow property set to hidden, while surfaces for unbounded ripples should have it set to visible. |

## Events

_None._

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `addRipple` | `addRipple(x: number, y: number) => Promise<() => void>` | Adds the ripple effect to the parent element. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
