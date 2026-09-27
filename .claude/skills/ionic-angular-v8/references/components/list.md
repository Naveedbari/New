# ion-list

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonList } from '@ionic/angular/standalone';
```

Add `IonList` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `inset` | `inset` | `boolean` | `false` | If `true`, the list will have margin around it and rounded corners. |
| `lines` | `lines` | `"full" \| "inset" \| "none" \| undefined` |  | How the bottom border should be displayed on all items. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |

## Events

_None._

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `closeSlidingItems` | `closeSlidingItems() => Promise<boolean>` | If `ion-item-sliding` are used inside the list, this method closes any open sliding item.  Returns `true` if an actual `ion-item-sliding` is closed. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
