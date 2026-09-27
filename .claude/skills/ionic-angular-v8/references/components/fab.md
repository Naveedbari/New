# ion-fab

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonFab } from '@ionic/angular/standalone';
```

Add `IonFab` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `activated` | `activated` | `boolean` | `false` | If `true`, both the `ion-fab-button` and all `ion-fab-list` inside `ion-fab` will become active. That means `ion-fab-button` will become a `close` icon and `ion-fab-list` will become visible. |
| `edge` | `edge` | `boolean` | `false` | If `true`, the fab will display on the edge of the header if `vertical` is `"top"`, and on the edge of the footer if it is `"bottom"`. Should be used with a `fixed` slot. |
| `horizontal` | `horizontal` | `"center" \| "end" \| "start" \| undefined` |  | Where to align the fab horizontally in the viewport. |
| `vertical` | `vertical` | `"bottom" \| "center" \| "top" \| undefined` |  | Where to align the fab vertically in the viewport. |

## Events

_None._

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `close` | `close() => Promise<void>` | Close an active FAB list container. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
