# ion-radio

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonRadio } from '@ionic/angular/standalone';
```

Add `IonRadio` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` | `"center" \| "start" \| undefined` |  | How to control the alignment of the radio and label on the cross axis. `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL. `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL. Setting this property will change the radio `display` to `block`. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the radio. |
| `justify` | `justify` | `"end" \| "space-between" \| "start" \| undefined` |  | How to pack the label and radio within a line. `"start"`: The label and radio will appear on the left in LTR and on the right in RTL. `"end"`: The label and radio will appear on the right in LTR and on the left in RTL. `"space-between"`: The label and radio will appear on opposite ends of the line with space between the two elements. Setting this property will change the radio `display` to `block`. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the radio. `"start"`: The label will appear to the left of the radio in LTR and to the right in RTL. `"end"`: The label will appear to the right of the radio in LTR and to the left in RTL. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). `"stacked"`: The label will appear above the radio regardless of the direction. The alignment of the label can be controlled with the `alignment` property. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `value` | `value` | `any` |  | the value of the radio. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the radio button loses focus. |
| `ionFocus` | `void` | Emitted when the radio button has focus. |

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | The label text to associate with the radio. Use the "labelPlacement" property to control where the label is placed relative to the radio. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `container` | The container for the radio mark. |
| `label` | The label text describing the radio. |
| `mark` | The checkmark or dot used to indicate the checked state. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--border-radius` | Border radius of the radio |
| `--color` | Color of the radio |
| `--color-checked` | Color of the checked radio |
| `--inner-border-radius` | Border radius of the inner checked radio |
