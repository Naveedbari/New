# ion-item-sliding

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonItemSliding } from '@ionic/angular/standalone';
```

Add `IonItemSliding` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the sliding item. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionDrag` | `any` | Emitted when the sliding position changes. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `close` | `close() => Promise<void>` | Close the sliding item. Items can also be closed from the [List](./list). |
| `closeOpened` | `closeOpened() => Promise<boolean>` | Close all of the sliding items in the list. Items can also be closed from the [List](./list). |
| `getOpenAmount` | `getOpenAmount() => Promise<number>` | Get the amount the item is open in pixels. |
| `getSlidingRatio` | `getSlidingRatio() => Promise<number>` | Get the ratio of the open amount of the item compared to the width of the options. If the number returned is positive, then the options on the right side are open. If the number returned is negative, then the options on the left side are open. If the absolute value of the number is greater than 1, the item is open more than the width of the options. |
| `open` | `open(side: Side \| undefined) => Promise<void>` | Open the sliding item. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
