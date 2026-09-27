# ion-textarea

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonTextarea } from '@ionic/angular/standalone';
```

Add `IonTextarea` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `autoGrow` | `auto-grow` | `boolean` | `false` | If `true`, the textarea container will grow and shrink based on the contents of the textarea. |
| `autocapitalize` | `autocapitalize` | `string` | `'none'` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`. |
| `autofocus` | `autofocus` | `boolean` | `false` | Sets the [`autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) on the native input element.  This may not be sufficient for the element to be focused on page load. See [managing focus](/docs/developing/managing-focus) for more information. |
| `clearOnEdit` | `clear-on-edit` | `boolean` | `false` | If `true`, the value will be cleared after focus upon edit. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `cols` | `cols` | `number \| undefined` |  | The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. |
| `counter` | `counter` | `boolean` | `false` | If `true`, a character counter will display the ratio of characters used and the total character limit. Developers must also set the `maxlength` property for the counter to be calculated correctly. |
| `counterFormatter` |  | `((inputLength: number, maxLength: number) => string) \| undefined` |  | A callback used to format the counter text. By default the counter text is set to "itemLength / maxLength".  See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this if you need to access `this` from within the callback. |
| `debounce` | `debounce` | `number \| undefined` |  | Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the textarea. |
| `enterkeyhint` | `enterkeyhint` | `"done" \| "enter" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  | A hint to the browser for which enter key to display. Possible values: `"enter"`, `"done"`, `"go"`, `"next"`, `"previous"`, `"search"`, and `"send"`. |
| `errorText` | `error-text` | `string \| undefined` |  | Text that is placed under the textarea and displayed when an error is detected. |
| `fill` | `fill` | `"outline" \| "solid" \| undefined` |  | The fill for the item. If `"solid"` the item will have a background. If `"outline"` the item will be transparent with a border. Only available in `md` mode. |
| `helperText` | `helper-text` | `string \| undefined` |  | Text that is placed under the textarea and displayed when no error is detected. |
| `inputmode` | `inputmode` | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` |  | A hint to the browser for which keyboard to display. Possible values: `"none"`, `"text"`, `"tel"`, `"url"`, `"email"`, `"numeric"`, `"decimal"`, and `"search"`. |
| `label` | `label` | `string \| undefined` |  | The visible label associated with the textarea.  Use this if you need to render a plaintext label.  The `label` property will take priority over the `label` slot if both are used. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Where to place the label relative to the textarea. `"start"`: The label will appear to the left of the textarea in LTR and to the right in RTL. `"end"`: The label will appear to the right of the textarea in LTR and to the left in RTL. `"floating"`: The label will appear smaller and above the textarea when the textarea is focused or it has a value. Otherwise it will appear on top of the textarea. `"stacked"`: The label will appear smaller and above the textarea regardless even when the textarea is blurred or has no value. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). |
| `maxlength` | `maxlength` | `number \| undefined` |  | This attribute specifies the maximum number of characters that the user can enter. |
| `minlength` | `minlength` | `number \| undefined` |  | This attribute specifies the minimum number of characters that the user can enter. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `placeholder` | `placeholder` | `string \| undefined` |  | Instructional text that shows before the input has a value. |
| `readonly` | `readonly` | `boolean` | `false` | If `true`, the user cannot modify the value. |
| `required` | `required` | `boolean` | `false` | If `true`, the user must fill in a value before submitting a form. |
| `rows` | `rows` | `number \| undefined` |  | The number of visible text lines for the control. |
| `shape` | `shape` | `"round" \| undefined` |  | The shape of the textarea. If "round" it will have an increased border radius. |
| `spellcheck` | `spellcheck` | `boolean` | `false` | If `true`, the element will have its spelling and grammar checked. |
| `value` | `value` | `null \| string \| undefined` | `''` | The value of the textarea. |
| `wrap` | `wrap` | `"hard" \| "off" \| "soft" \| undefined` |  | Indicates how the control wraps text. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `FocusEvent` | Emitted when the input loses focus. |
| `ionChange` | `TextareaChangeEventDetail` | The `ionChange` event is fired when the user modifies the textarea's value. Unlike the `ionInput` event, the `ionChange` event is fired when the element loses focus after its value has been modified.  This event will not emit when programmatically setting the `value` property. |
| `ionFocus` | `FocusEvent` | Emitted when the input has focus. |
| `ionInput` | `TextareaInputEventDetail` | The `ionInput` event is fired each time the user modifies the textarea's value. Unlike the `ionChange` event, the `ionInput` event is fired for each alteration to the textarea's value. This typically happens for each keystroke as the user types.  When `clearOnEdit` is enabled, the `ionInput` event will be fired when the user clears the textarea by performing a keydown event. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getInputElement` | `getInputElement() => Promise<HTMLTextAreaElement>` | Returns the native `<textarea>` element used under the hood. |
| `setFocus` | `setFocus() => Promise<void>` | Sets focus on the native `textarea` in `ion-textarea`. Use this method instead of the global `textarea.focus()`.  See [managing focus](/docs/developing/managing-focus) for more information. |

## Slots

| Slot | Description |
| --- | --- |
| `end` | Content to display at the trailing edge of the textarea. (EXPERIMENTAL) |
| `label` | The label text to associate with the textarea. Use the `labelPlacement` property to control where the label is placed relative to the textarea. Use this if you need to render a label with custom HTML. (EXPERIMENTAL) |
| `start` | Content to display at the leading edge of the textarea. (EXPERIMENTAL) |

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the textarea |
| `--border-color` | Color of the border below the textarea when using helper text, error text, or counter |
| `--border-radius` | Border radius of the textarea |
| `--border-style` | Style of the border below the textarea when using helper text, error text, or counter |
| `--border-width` | Width of the border below the textarea when using helper text, error text, or counter |
| `--color` | Color of the text |
| `--highlight-color-focused` | The color of the highlight on the textarea when focused |
| `--highlight-color-invalid` | The color of the highlight on the textarea when invalid |
| `--highlight-color-valid` | The color of the highlight on the textarea when valid |
| `--highlight-height` | The height of the highlight on the textarea. Only applies to md mode. |
| `--padding-bottom` | Bottom padding of the textarea |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the textarea |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the textarea |
| `--padding-top` | Top padding of the textarea |
| `--placeholder-color` | Color of the placeholder text |
| `--placeholder-font-style` | Style of the placeholder text |
| `--placeholder-font-weight` | Weight of the placeholder text |
| `--placeholder-opacity` | Opacity of the placeholder text |
