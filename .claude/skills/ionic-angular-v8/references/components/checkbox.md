# ion-checkbox

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonCheckbox } from '@ionic/angular/standalone';
```

Add `IonCheckbox` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` | `"center" \| "start" \| undefined` |  | How to control the alignment of the checkbox and label on the cross axis. `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL. `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL. Setting this property will change the checkbox `display` to `block`. |
| `checked` | `checked` | `boolean` | `false` | If `true`, the checkbox is selected. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the checkbox. |
| `errorText` | `error-text` | `string \| undefined` |  | Text that is placed under the checkbox label and displayed when an error is detected. |
| `helperText` | `helper-text` | `string \| undefined` |  | Text that is placed under the checkbox label and displayed when no error is detected. |
| `indeterminate` | `indeterminate` | `boolean` | `false` | If `true`, the checkbox will visually appear as indeterminate. |
| `justify` | `justify` | `"end" \| "space-between" \| "start" \| undefined` |  | How to pack the label and checkbox within a line. `"start"`: The label and checkbox will appear on the left in LTR and on the right in RTL. `"end"`: The label and checkbox will appear on the right in LTR and on the left in RTL. `"space-between"`: The label and checkbox will appear on opposite ends of the line with space between the two elements. Setting this property will change the checkbox `display` to `block`. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the checkbox. `"start"`: The label will appear to the left of the checkbox in LTR and to the right in RTL. `"end"`: The label will appear to the right of the checkbox in LTR and to the left in RTL. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). `"stacked"`: The label will appear above the checkbox regardless of the direction. The alignment of the label can be controlled with the `alignment` property. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `required` | `required` | `boolean` | `false` | If true, screen readers will announce it as a required field. This property works only for accessibility purposes, it will not prevent the form from submitting if the value is invalid. |
| `value` | `value` | `any` | `'on'` | The value of the checkbox does not mean if it's checked or not, use the `checked` property for that.  The value of a checkbox is analogous to the value of an `<input type="checkbox">`, it's only used when the checkbox participates in a native `<form>`. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the checkbox loses focus. |
| `ionChange` | `CheckboxChangeEventDetail<any>` | Emitted when the checked property has changed as a result of a user action such as a click.  This event will not emit when programmatically setting the `checked` property. |
| `ionFocus` | `void` | Emitted when the checkbox has focus. |

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | The label text to associate with the checkbox. Use the "labelPlacement" property to control where the label is placed relative to the checkbox. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `container` | The container for the checkbox mark. |
| `error-text` | Supporting text displayed beneath the checkbox label when the checkbox is invalid and touched. |
| `helper-text` | Supporting text displayed beneath the checkbox label when the checkbox is valid. |
| `label` | The label text describing the checkbox. |
| `mark` | The checkmark used to indicate the checked state. |
| `supporting-text` | Supporting text displayed beneath the checkbox label. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--border-color` | Border color of the checkbox icon |
| `--border-color-checked` | Border color of the checkbox icon when checked |
| `--border-radius` | Border radius of the checkbox icon |
| `--border-style` | Border style of the checkbox icon |
| `--border-width` | Border width of the checkbox icon |
| `--checkbox-background` | Background of the checkbox icon |
| `--checkbox-background-checked` | Background of the checkbox icon when checked |
| `--checkmark-color` | Color of the checkbox checkmark when checked |
| `--checkmark-width` | Stroke width of the checkbox checkmark |
| `--size` | Size of the checkbox icon |
| `--transition` | Transition of the checkbox icon |
