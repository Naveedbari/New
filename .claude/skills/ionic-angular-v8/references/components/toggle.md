# ion-toggle

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonToggle } from '@ionic/angular/standalone';
```

Add `IonToggle` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` | `"center" \| "start" \| undefined` |  | How to control the alignment of the toggle and label on the cross axis. `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL. `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL. Setting this property will change the toggle `display` to `block`. |
| `checked` | `checked` | `boolean` | `false` | If `true`, the toggle is selected. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the toggle. |
| `enableOnOffLabels` | `enable-on-off-labels` | `boolean \| undefined` | `config.get('toggleOnOffLabels')` | Enables the on/off accessibility switch labels within the toggle. |
| `errorText` | `error-text` | `string \| undefined` |  | Text that is placed under the toggle label and displayed when an error is detected. |
| `helperText` | `helper-text` | `string \| undefined` |  | Text that is placed under the toggle label and displayed when no error is detected. |
| `justify` | `justify` | `"end" \| "space-between" \| "start" \| undefined` |  | How to pack the label and toggle within a line. `"start"`: The label and toggle will appear on the left in LTR and on the right in RTL. `"end"`: The label and toggle will appear on the right in LTR and on the left in RTL. `"space-between"`: The label and toggle will appear on opposite ends of the line with space between the two elements. Setting this property will change the toggle `display` to `block`. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the input. `"start"`: The label will appear to the left of the toggle in LTR and to the right in RTL. `"end"`: The label will appear to the right of the toggle in LTR and to the left in RTL. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). `"stacked"`: The label will appear above the toggle regardless of the direction. The alignment of the label can be controlled with the `alignment` property. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `required` | `required` | `boolean` | `false` | If true, screen readers will announce it as a required field. This property works only for accessibility purposes, it will not prevent the form from submitting if the value is invalid. |
| `value` | `value` | `null \| string \| undefined` | `'on'` | The value of the toggle does not mean if it's checked or not, use the `checked` property for that.  The value of a toggle is analogous to the value of a `<input type="checkbox">`, it's only used when the toggle participates in a native `<form>`. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the toggle loses focus. |
| `ionChange` | `ToggleChangeEventDetail<any>` | Emitted when the user switches the toggle on or off.  This event will not emit when programmatically setting the `checked` property. |
| `ionFocus` | `void` | Emitted when the toggle has focus. |

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | The label text to associate with the toggle. Use the "labelPlacement" property to control where the label is placed relative to the toggle. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `error-text` | Supporting text displayed beneath the toggle label when the toggle is invalid and touched. |
| `handle` | The toggle handle, or knob, used to change the checked state. |
| `helper-text` | Supporting text displayed beneath the toggle label when the toggle is valid. |
| `label` | The label text describing the toggle. |
| `supporting-text` | Supporting text displayed beneath the toggle label. |
| `track` | The background track of the toggle. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--border-radius` | Border radius of the toggle track |
| `--handle-background` | Background of the toggle handle |
| `--handle-background-checked` | Background of the toggle handle when checked |
| `--handle-border-radius` | Border radius of the toggle handle |
| `--handle-box-shadow` | Box shadow of the toggle handle |
| `--handle-height` | Height of the toggle handle |
| `--handle-max-height` | Maximum height of the toggle handle |
| `--handle-spacing` | Horizontal spacing around the toggle handle |
| `--handle-transition` | Transition of the toggle handle |
| `--handle-width` | Width of the toggle handle |
| `--track-background` | Background of the toggle track |
| `--track-background-checked` | Background of the toggle track when checked |

## Renders sub-components

`ion-icon`
