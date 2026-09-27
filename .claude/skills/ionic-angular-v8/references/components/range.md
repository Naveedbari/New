# ion-range

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonRange } from '@ionic/angular/standalone';
```

Add `IonRange` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `activeBarStart` | `active-bar-start` | `number \| undefined` |  | The start position of the range active bar. This feature is only available with a single knob (dualKnobs="false"). Valid values are greater than or equal to the min value and less than or equal to the max value. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `debounce` | `debounce` | `number \| undefined` |  | How long, in milliseconds, to wait to trigger the `ionInput` event after each change in the range value. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the range. |
| `dualKnobs` | `dual-knobs` | `boolean` | `false` | Show two knobs. |
| `label` | `label` | `string \| undefined` |  | The text to display as the control's label. Use this over the `label` slot if you only need plain text. The `label` property will take priority over the `label` slot if both are used. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the range. `"start"`: The label will appear to the left of the range in LTR and to the right in RTL. `"end"`: The label will appear to the right of the range in LTR and to the left in RTL. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). `"stacked"`: The label will appear above the range regardless of the direction. |
| `max` | `max` | `number` | `100` | Maximum integer value of the range. |
| `min` | `min` | `number` | `0` | Minimum integer value of the range. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.rangeId` | The name of the control, which is submitted with the form data. |
| `pin` | `pin` | `boolean` | `false` | If `true`, a pin with integer value is shown when the knob is pressed. |
| `pinFormatter` |  | `(value: number) => string \| number` | `(value: number): number => Math.round(value)` | A callback used to format the pin text. By default the pin text is set to `Math.round(value)`.  See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this if you need to access `this` from within the callback. |
| `snaps` | `snaps` | `boolean` | `false` | If `true`, the knob snaps to tick marks evenly spaced based on the step property value. |
| `step` | `step` | `number` | `1` | Specifies the value granularity. |
| `ticks` | `ticks` | `boolean` | `true` | If `true`, tick marks are displayed based on the step value. Only applies when `snaps` is `true`. |
| `value` | `value` | `number \| { lower: number; upper: number; }` | `0` | the value of the range. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the range loses focus. |
| `ionChange` | `RangeChangeEventDetail` | The `ionChange` event is fired for `<ion-range>` elements when the user modifies the element's value: - When the user releases the knob after dragging; - When the user moves the knob with keyboard arrows  This event will not emit when programmatically setting the `value` property. |
| `ionFocus` | `void` | Emitted when the range has focus. |
| `ionInput` | `RangeChangeEventDetail` | The `ionInput` event is fired for `<ion-range>` elements when the value is modified. Unlike `ionChange`, `ionInput` is fired continuously while the user is dragging the knob. |
| `ionKnobMoveEnd` | `RangeKnobMoveEndEventDetail` | Emitted when the user finishes moving the range knob, whether through mouse drag, touch gesture, or keyboard interaction. |
| `ionKnobMoveStart` | `RangeKnobMoveStartEventDetail` | Emitted when the user starts moving the range knob, whether through mouse drag, touch gesture, or keyboard interaction. |

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `end` | Content is placed to the right of the range slider in LTR, and to the left in RTL. |
| `label` | The label text to associate with the range. Use the "labelPlacement" property to control where the label is placed relative to the range. |
| `start` | Content is placed to the left of the range slider in LTR, and to the right in RTL. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `activated` | Added to the knob-handle, knob, and pin when the knob is active. Only one set has this part at a time when `dualKnobs` is `true`. |
| `bar` | The inactive part of the bar. |
| `bar-active` | The active part of the bar. |
| `focused` | Added to the knob-handle, knob, and pin that currently has focus. Only one set has this part at a time when `dualKnobs` is `true`. |
| `hover` | Added to the knob-handle, knob, and pin when the knob has hover. Only one set has this part at a time when `dualKnobs` is `true`. |
| `knob` | The visual knob element on the range track. |
| `knob-a` | The visual knob for the static `A` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `knob-b` | The visual knob for the static `B` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `knob-handle` | The container that wraps the knob and handles drag interactions. |
| `knob-handle-a` | The container for the knob with the static `A` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `knob-handle-b` | The container for the knob with the static `B` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `knob-handle-lower` | The container for the knob whose current `value` is `lower` when `dualKnobs` is `true`. The lower and upper parts swap which knob handle they refer to when the knobs cross. |
| `knob-handle-upper` | The container for the knob whose current `value` is `upper` when `dualKnobs` is `true`. The lower and upper parts swap which knob handle they refer to when the knobs cross. |
| `knob-lower` | The visual knob whose current `value` is `lower` when `dualKnobs` is `true`. The lower and upper parts swap which knob they refer to when the knobs cross. |
| `knob-upper` | The visual knob whose current `value` is `upper` when `dualKnobs` is `true`. The lower and upper parts swap which knob they refer to when the knobs cross. |
| `label` | The label text describing the range. |
| `pin` | The value indicator displayed above a knob. |
| `pin-a` | The value indicator above the knob with the static `A` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `pin-b` | The value indicator above the knob with the static `B` identity when `dualKnobs` is `true`. This identity does not change, even if the knobs cross and swap which one represents the lower or upper value. |
| `pin-lower` | The value indicator above the knob whose current `value` is `lower` when `dualKnobs` is `true`. The lower and upper parts swap which pin they refer to when the knobs cross. |
| `pin-upper` | The value indicator above the knob whose current `value` is `upper` when `dualKnobs` is `true`. The lower and upper parts swap which pin they refer to when the knobs cross. |
| `pressed` | Added to the knob-handle, knob, and pin that is currently being pressed to drag. Only one set has this part at a time when `dualKnobs` is `true`. |
| `tick` | An inactive tick mark. |
| `tick-active` | An active tick mark. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--bar-background` | Background of the range bar |
| `--bar-background-active` | Background of the active range bar |
| `--bar-border-radius` | Border radius of the range bar |
| `--bar-height` | Height of the range bar |
| `--height` | Height of the range |
| `--knob-background` | Background of the range knob |
| `--knob-border-radius` | Border radius of the range knob |
| `--knob-box-shadow` | Box shadow of the range knob |
| `--knob-size` | Size of the range knob |
| `--pin-background` | Background of the range pin (only available in MD mode) |
| `--pin-color` | Color of the range pin (only available in MD mode) |
