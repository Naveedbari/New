# ion-refresher

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonRefresher } from '@ionic/angular/standalone';
```

Add `IonRefresher` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `closeDuration` | `close-duration` | `string` | `'280ms'` | Time it takes to close the refresher. Does not apply when the refresher content uses a spinner, enabling the native refresher. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the refresher will be hidden. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `pullFactor` | `pull-factor` | `number` | `1` | How much to multiply the pull speed by. To slow the pull animation down, pass a number less than `1`. To speed up the pull, pass a number greater than `1`. The default value is `1` which is equal to the speed of the cursor. If a negative value is passed in, the factor will be `1` instead.  For example, If the value passed is `1.2` and the content is dragged by `10` pixels, instead of `10` pixels, the content will be pulled by `12` pixels (an increase of 20 percent). If the value passed is `0.8`, the dragged amount will be `8` pixels, less than the amount the cursor has moved.  Does not apply when the refresher content uses a spinner, enabling the native refresher. |
| `pullMax` | `pull-max` | `number` | `this.pullMin + 60` | The maximum distance of the pull until the refresher will automatically go into the `refreshing` state. Defaults to the result of `pullMin + 60`. Does not apply when  the refresher content uses a spinner, enabling the native refresher. |
| `pullMin` | `pull-min` | `number` | `60` | The minimum distance the user must pull down until the refresher will go into the `refreshing` state. Does not apply when the refresher content uses a spinner, enabling the native refresher. |
| `snapbackDuration` | `snapback-duration` | `string` | `'280ms'` | Time it takes the refresher to snap back to the `refreshing` state. Does not apply when the refresher content uses a spinner, enabling the native refresher. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionPull` | `void` | Emitted while the user is pulling down the content and exposing the refresher. |
| `ionPullEnd` | `RefresherPullEndEventDetail` | Emitted when the refresher has returned to the inactive state after a pull gesture. This fires whether the refresh completed successfully or was canceled. |
| `ionPullStart` | `void` | Emitted when the user begins to start pulling down. |
| `ionRefresh` | `RefresherEventDetail` | Emitted when the user lets go of the content and has pulled down further than the `pullMin` or pulls the content down and exceeds the pullMax. Updates the refresher state to `refreshing`. The `complete()` method should be called when the async operation has completed. |
| `ionStart` | `void` | Emitted when the user begins to start pulling down. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `cancel` | `cancel() => Promise<void>` | Changes the refresher's state from `refreshing` to `cancelling`. |
| `complete` | `complete() => Promise<void>` | Call `complete()` when your async operation has completed. For example, the `refreshing` state is while the app is performing an asynchronous operation, such as receiving more data from an AJAX request. Once the data has been received, you then call this method to signify that the refreshing has completed and to close the refresher. This method also changes the refresher's state from `refreshing` to `completing`. |
| `getProgress` | `getProgress() => Promise<number>` | A number representing how far down the user has pulled. The number `0` represents the user hasn't pulled down at all. The number `1`, and anything greater than `1`, represents that the user has pulled far enough down that when they let go then the refresh will happen. If they let go and the number is less than `1`, then the refresh will not happen, and the content will return to it's original position. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
