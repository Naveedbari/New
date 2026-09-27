# ion-progress-bar

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonProgressBar } from '@ionic/angular/standalone';
```

Add `IonProgressBar` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `buffer` | `buffer` | `number` | `1` | If the buffer and value are smaller than 1, the buffer circles will show. The buffer should be between [0, 1]. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `reversed` | `reversed` | `boolean` | `false` | If true, reverse the progress bar direction. |
| `type` | `type` | `"determinate" \| "indeterminate"` | `'determinate'` | The state of the progress bar, based on if the time the process takes is known or not. Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right). |
| `value` | `value` | `number` | `0` | The value determines how much of the active bar should display when the `type` is `"determinate"`. The value should be between [0, 1]. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `progress` | The progress bar that shows the current value when `type` is `"determinate"` and slides back and forth when `type` is `"indeterminate"`. |
| `stream` | The animated circles that appear while buffering. This only shows when `buffer` is set and `type` is `"determinate"`. |
| `track` | The track bar behind the progress bar. If the `buffer` property is set and `type` is `"determinate"` the track will be the width of the `buffer` value. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the progress track, or the buffer bar if `buffer` is set |
| `--progress-background` | Background of the progress bar representing the current value |
