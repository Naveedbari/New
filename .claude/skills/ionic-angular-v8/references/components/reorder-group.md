# ion-reorder-group

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonReorderGroup } from '@ionic/angular/standalone';
```

Add `IonReorderGroup` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` | `true` | If `true`, the reorder will be hidden. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionItemReorder` | `ItemReorderEventDetail` | Event that needs to be listened to in order to complete the reorder action. |
| `ionReorderEnd` | `ReorderEndEventDetail` | Event that is emitted when the reorder gesture ends. The from and to properties are always available, regardless of if the reorder gesture moved the item. If the item did not change from its start position, the from and to properties will be the same. Once the event has been emitted, the `complete()` method then needs to be called in order to finalize the reorder action. |
| `ionReorderMove` | `ReorderMoveEventDetail` | Event that is emitted as the reorder gesture moves. |
| `ionReorderStart` | `void` | Event that is emitted when the reorder gesture starts. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `complete` | `complete(listOrReorder?: boolean \| any[]) => Promise<any>` | Completes the reorder operation. Must be called by the `ionReorderEnd` event.  If a list of items is passed, the list will be reordered and returned in the proper order.  If no parameters are passed or if `true` is passed in, the reorder will complete and the item will remain in the position it was dragged to. If `false` is passed, the reorder will complete and the item will bounce back to its original position. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
