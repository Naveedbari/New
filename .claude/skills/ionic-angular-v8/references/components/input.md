# ion-input

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonInput } from '@ionic/angular/standalone';
```

Add `IonInput` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `autocapitalize` | `autocapitalize` | `string` | `'off'` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`. |
| `autocomplete` | `autocomplete` | `"additional-name" \| "address-level1" \| "address-level2" \| "address-level3" \| "address-level4" \| "address-line1" \| "address-line2" \| "address-line3" \| "bday" \| "bday-day" \| "bday-month" \| "bday-year" \| "cc-additional-name" \| "cc-csc" \| "cc-exp" \| "cc-exp-month" \| "cc-exp-year" \| "cc-family-name" \| "cc-given-name" \| "cc-name" \| "cc-number" \| "cc-type" \| "country" \| "country-name" \| "current-password" \| "email" \| "family-name" \| "given-name" \| "honorific-prefix" \| "honorific-suffix" \| "impp" \| "language" \| "name" \| "new-password" \| "nickname" \| "off" \| "on" \| "one-time-code" \| "organization" \| "organization-title" \| "photo" \| "postal-code" \| "sex" \| "street-address" \| "tel" \| "tel-area-code" \| "tel-country-code" \| "tel-extension" \| "tel-local" \| "tel-national" \| "transaction-amount" \| "transaction-currency" \| "url" \| "username"` | `'off'` | Indicates whether the value of the control can be automatically completed by the browser. |
| `autocorrect` | `autocorrect` | `"off" \| "on"` | `'off'` | Whether auto correction should be enabled when the user is entering/editing the text value. |
| `autofocus` | `autofocus` | `boolean` | `false` | Sets the [`autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) on the native input element.  This may not be sufficient for the element to be focused on page load. See [managing focus](/docs/developing/managing-focus) for more information. |
| `clearInput` | `clear-input` | `boolean` | `false` | If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input. |
| `clearInputIcon` | `clear-input-icon` | `string \| undefined` |  | The icon to use for the clear button. Only applies when `clearInput` is set to `true`. |
| `clearOnEdit` | `clear-on-edit` | `boolean \| undefined` |  | If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `counter` | `counter` | `boolean` | `false` | If `true`, a character counter will display the ratio of characters used and the total character limit. Developers must also set the `maxlength` property for the counter to be calculated correctly. |
| `counterFormatter` |  | `((inputLength: number, maxLength: number) => string) \| undefined` |  | A callback used to format the counter text. By default the counter text is set to "itemLength / maxLength".  See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this if you need to access `this` from within the callback. |
| `debounce` | `debounce` | `number \| undefined` |  | Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the input. |
| `enterkeyhint` | `enterkeyhint` | `"done" \| "enter" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  | A hint to the browser for which enter key to display. Possible values: `"enter"`, `"done"`, `"go"`, `"next"`, `"previous"`, `"search"`, and `"send"`. |
| `errorText` | `error-text` | `string \| undefined` |  | Text that is placed under the input and displayed when an error is detected. |
| `fill` | `fill` | `"outline" \| "solid" \| undefined` |  | The fill for the item. If `"solid"` the item will have a background. If `"outline"` the item will be transparent with a border. Only available in `md` mode. |
| `helperText` | `helper-text` | `string \| undefined` |  | Text that is placed under the input and displayed when no error is detected. |
| `inputmode` | `inputmode` | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` |  | A hint to the browser for which keyboard to display. Possible values: `"none"`, `"text"`, `"tel"`, `"url"`, `"email"`, `"numeric"`, `"decimal"`, and `"search"`. |
| `label` | `label` | `string \| undefined` |  | The visible label associated with the input.  Use this if you need to render a plaintext label.  The `label` property will take priority over the `label` slot if both are used. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the input. `"start"`: The label will appear to the left of the input in LTR and to the right in RTL. `"end"`: The label will appear to the right of the input in LTR and to the left in RTL. `"floating"`: The label will appear smaller and above the input when the input is focused or it has a value. Otherwise it will appear on top of the input. `"stacked"`: The label will appear smaller and above the input regardless even when the input is blurred or has no value. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). |
| `max` | `max` | `number \| string \| undefined` |  | The maximum value, which must not be less than its minimum (min attribute) value. |
| `maxlength` | `maxlength` | `number \| undefined` |  | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter. |
| `min` | `min` | `number \| string \| undefined` |  | The minimum value, which must not be greater than its maximum (max attribute) value. |
| `minlength` | `minlength` | `number \| undefined` |  | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `multiple` | `multiple` | `boolean \| undefined` |  | If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"`, otherwise it is ignored. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `pattern` | `pattern` | `string \| undefined` |  | A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, `"date"`, or `"password"`, otherwise it is ignored. When the type attribute is `"date"`, `pattern` will only be used in browsers that do not support the `"date"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information. |
| `placeholder` | `placeholder` | `string \| undefined` |  | Instructional text that shows before the input has a value. This property applies only when the `type` property is set to `"email"`, `"number"`, `"password"`, `"search"`, `"tel"`, `"text"`, or `"url"`, otherwise it is ignored. |
| `readonly` | `readonly` | `boolean` | `false` | If `true`, the user cannot modify the value. |
| `required` | `required` | `boolean` | `false` | If `true`, the user must fill in a value before submitting a form. |
| `shape` | `shape` | `"round" \| undefined` |  | The shape of the input. If "round" it will have an increased border radius. |
| `spellcheck` | `spellcheck` | `boolean` | `false` | If `true`, the element will have its spelling and grammar checked. |
| `step` | `step` | `string \| undefined` |  | Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number. |
| `type` | `type` | `"date" \| "datetime-local" \| "email" \| "month" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "time" \| "url" \| "week"` | `'text'` | The type of control to display. The default type is text. |
| `value` | `value` | `null \| number \| string \| undefined` | `''` | The value of the input. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `FocusEvent` | Emitted when the input loses focus. |
| `ionChange` | `InputChangeEventDetail` | The `ionChange` event is fired when the user modifies the input's value. Unlike the `ionInput` event, the `ionChange` event is only fired when changes are committed, not as the user types.  Depending on the way the users interacts with the element, the `ionChange` event fires at a different moment: - When the user commits the change explicitly (e.g. by selecting a date from a date picker for `<ion-input type="date">`, pressing the "Enter" key, etc.). - When the element loses focus after its value has changed: for elements where the user's interaction is typing.  This event will not emit when programmatically setting the `value` property. |
| `ionFocus` | `FocusEvent` | Emitted when the input has focus. |
| `ionInput` | `InputInputEventDetail` | The `ionInput` event is fired each time the user modifies the input's value. Unlike the `ionChange` event, the `ionInput` event is fired for each alteration to the input's value. This typically happens for each keystroke as the user types.  For elements that accept text input (`type=text`, `type=tel`, etc.), the interface is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others, the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If the input is cleared on edit, the type is `null`. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getInputElement` | `getInputElement() => Promise<HTMLInputElement>` | Returns the native `<input>` element used under the hood. |
| `setFocus` | `setFocus() => Promise<void>` | Sets focus on the native `input` in `ion-input`. Use this method instead of the global `input.focus()`.  Developers who wish to focus an input when a page enters should call `setFocus()` in the `ionViewDidEnter()` lifecycle method.  Developers who wish to focus an input when an overlay is presented should call `setFocus` after `didPresent` has resolved.  See [managing focus](/docs/developing/managing-focus) for more information. |

## Slots

| Slot | Description |
| --- | --- |
| `end` | Content to display at the trailing edge of the input. (EXPERIMENTAL) |
| `label` | The label text to associate with the input. Use the `labelPlacement` property to control where the label is placed relative to the input. Use this if you need to render a label with custom HTML. (EXPERIMENTAL) |
| `start` | Content to display at the leading edge of the input. (EXPERIMENTAL) |

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the input |
| `--border-color` | Color of the border below the input when using helper text, error text, or counter |
| `--border-radius` | Radius of the input. A large radius may display unevenly when using fill="outline"; if needed, use shape="round" instead or increase --padding-start. |
| `--border-style` | Style of the border below the input when using helper text, error text, or counter |
| `--border-width` | Width of the border below the input when using helper text, error text, or counter |
| `--color` | Color of the input text |
| `--highlight-color-focused` | The color of the highlight on the input when focused |
| `--highlight-color-invalid` | The color of the highlight on the input when invalid |
| `--highlight-color-valid` | The color of the highlight on the input when valid |
| `--highlight-height` | The height of the highlight on the input. Only applies to md mode. |
| `--padding-bottom` | Bottom padding of the input |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the input |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the input |
| `--padding-top` | Top padding of the input |
| `--placeholder-color` | Color of the input placeholder text |
| `--placeholder-font-style` | Font style of the input placeholder text |
| `--placeholder-font-weight` | Font weight of the input placeholder text |
| `--placeholder-opacity` | Opacity of the input placeholder text |

## Renders sub-components

`ion-icon`
