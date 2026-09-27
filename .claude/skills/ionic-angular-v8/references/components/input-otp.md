# ion-input-otp

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonInputOtp } from '@ionic/angular/standalone';
```

Add `IonInputOtp` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `autocapitalize` | `autocapitalize` | `string` | `'off'` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the input. |
| `fill` | `fill` | `"outline" \| "solid" \| undefined` | `'outline'` | The fill for the input boxes. If `"solid"` the input boxes will have a background. If `"outline"` the input boxes will be transparent with a border. |
| `inputmode` | `inputmode` | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` |  | A hint to the browser for which keyboard to display. Possible values: `"none"`, `"text"`, `"tel"`, `"url"`, `"email"`, `"numeric"`, `"decimal"`, and `"search"`.  For numbers (type="number"): "numeric" For text (type="text"): "text" |
| `length` | `length` | `number` | `4` | The number of input boxes to display. |
| `pattern` | `pattern` | `string \| undefined` |  | A regex pattern string for allowed characters. Defaults based on type.  For numbers (`type="number"`): `"[\p{N}]"` For text (`type="text"`): `"[\p{L}\p{N}]"` |
| `readonly` | `readonly` | `boolean` | `false` | If `true`, the user cannot modify the value. |
| `separators` | `separators` | `number[] \| string \| undefined` |  | Where separators should be shown between input boxes. Can be a comma-separated string or an array of numbers.  For example: `"3"` will show a separator after the 3rd input box. `[1,4]` will show a separator after the 1st and 4th input boxes. `"all"` will show a separator between every input box. |
| `shape` | `shape` | `"rectangular" \| "round" \| "soft"` | `'round'` | The shape of the input boxes. If "round" they will have an increased border radius. If "rectangular" they will have no border radius. If "soft" they will have a soft border radius. |
| `size` | `size` | `"large" \| "medium" \| "small"` | `'medium'` | The size of the input boxes. |
| `type` | `type` | `"number" \| "text"` | `'number'` | The type of input allowed in the input boxes. |
| `value` | `value` | `null \| number \| string \| undefined` | `''` | The value of the input group. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `FocusEvent` | Emitted when the input group loses focus. |
| `ionChange` | `InputOtpChangeEventDetail` | The `ionChange` event is fired when the user modifies the input's value. Unlike the `ionInput` event, the `ionChange` event is only fired when changes are committed, not as the user types.  The `ionChange` event fires when the `<ion-input-otp>` component loses focus after its value has changed.  This event will not emit when programmatically setting the `value` property. |
| `ionComplete` | `InputOtpCompleteEventDetail` | Emitted when all input boxes have been filled with valid values. |
| `ionFocus` | `FocusEvent` | Emitted when the input group has focus. |
| `ionInput` | `InputOtpInputEventDetail` | The `ionInput` event is fired each time the user modifies the input's value. Unlike the `ionChange` event, the `ionInput` event is fired for each alteration to the input's value. This typically happens for each keystroke as the user types.  For elements that accept text input (`type=text`, `type=tel`, etc.), the interface is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others, the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If the input is cleared on edit, the type is `null`. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `setFocus` | `setFocus(index?: number) => Promise<void>` | Sets focus to an input box. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background color of the input boxes |
| `--border-color` | Border color of the input boxes |
| `--border-radius` | Border radius of the input boxes |
| `--border-width` | Border width of the input boxes |
| `--color` | Text color of the input |
| `--height` | Height of input boxes |
| `--highlight-color-focused` | The color of the highlight on the input when focused |
| `--highlight-color-invalid` | The color of the highlight on the input when invalid |
| `--highlight-color-valid` | The color of the highlight on the input when valid |
| `--margin-bottom` | Bottom margin of the input group |
| `--margin-end` | Right margin if direction is left-to-right, and left margin if direction is right-to-left of the input group |
| `--margin-start` | Left margin if direction is left-to-right, and right margin if direction is right-to-left of the input group |
| `--margin-top` | Top margin of the input group |
| `--min-width` | Minimum width of input boxes |
| `--padding-bottom` | Bottom padding of the input group |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the input group |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the input group |
| `--padding-top` | Top padding of the input group |
| `--separator-border-radius` | Border radius of the separator between boxes |
| `--separator-color` | Color of the separator between boxes |
| `--separator-height` | Height of the separator between boxes |
| `--separator-width` | Width of the separator between boxes |
| `--width` | Width of input boxes |
