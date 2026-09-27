# ion-searchbar

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonSearchbar } from '@ionic/angular/standalone';
```

Add `IonSearchbar` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `false` | If `true`, enable searchbar animation. |
| `autocapitalize` | `autocapitalize` | `string` | `'off'` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Available options: `"off"`, `"none"`, `"on"`, `"sentences"`, `"words"`, `"characters"`. |
| `autocomplete` | `autocomplete` | `"additional-name" \| "address-level1" \| "address-level2" \| "address-level3" \| "address-level4" \| "address-line1" \| "address-line2" \| "address-line3" \| "bday" \| "bday-day" \| "bday-month" \| "bday-year" \| "cc-additional-name" \| "cc-csc" \| "cc-exp" \| "cc-exp-month" \| "cc-exp-year" \| "cc-family-name" \| "cc-given-name" \| "cc-name" \| "cc-number" \| "cc-type" \| "country" \| "country-name" \| "current-password" \| "email" \| "family-name" \| "given-name" \| "honorific-prefix" \| "honorific-suffix" \| "impp" \| "language" \| "name" \| "new-password" \| "nickname" \| "off" \| "on" \| "one-time-code" \| "organization" \| "organization-title" \| "photo" \| "postal-code" \| "sex" \| "street-address" \| "tel" \| "tel-area-code" \| "tel-country-code" \| "tel-extension" \| "tel-local" \| "tel-national" \| "transaction-amount" \| "transaction-currency" \| "url" \| "username"` | `'off'` | Set the input's autocomplete property. |
| `autocorrect` | `autocorrect` | `"off" \| "on"` | `'off'` | Set the input's autocorrect property. |
| `cancelButtonIcon` | `cancel-button-icon` | `string` | `config.get('backButtonIcon', arrowBackSharp) as string` | Set the cancel button icon. Only applies to `md` mode. Defaults to `arrow-back-sharp`. |
| `cancelButtonText` | `cancel-button-text` | `string` | `'Cancel'` | Set the cancel button text. Only applies to `ios` mode. |
| `clearIcon` | `clear-icon` | `string \| undefined` |  | Set the clear icon. Defaults to `close-circle` for `ios` and `close-sharp` for `md`. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `debounce` | `debounce` | `number \| undefined` |  | Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the input. |
| `enterkeyhint` | `enterkeyhint` | `"done" \| "enter" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  | A hint to the browser for which enter key to display. Possible values: `"enter"`, `"done"`, `"go"`, `"next"`, `"previous"`, `"search"`, and `"send"`. |
| `inputmode` | `inputmode` | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` |  | A hint to the browser for which keyboard to display. Possible values: `"none"`, `"text"`, `"tel"`, `"url"`, `"email"`, `"numeric"`, `"decimal"`, and `"search"`. |
| `maxlength` | `maxlength` | `number \| undefined` |  | This attribute specifies the maximum number of characters that the user can enter. |
| `minlength` | `minlength` | `number \| undefined` |  | This attribute specifies the minimum number of characters that the user can enter. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `name` | `name` | `string` | `this.inputId` | If used in a form, set the name of the control, which is submitted with the form data. |
| `placeholder` | `placeholder` | `string` | `'Search'` | Set the input's placeholder. `placeholder` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security) |
| `searchIcon` | `search-icon` | `string \| undefined` |  | The icon to use as the search icon. Defaults to `search-outline` in `ios` mode and `search-sharp` in `md` mode. |
| `showCancelButton` | `show-cancel-button` | `"always" \| "focus" \| "never"` | `'never'` | Sets the behavior for the cancel button. Defaults to `"never"`. Setting to `"focus"` shows the cancel button on focus. Setting to `"never"` hides the cancel button. Setting to `"always"` shows the cancel button regardless of focus state. |
| `showClearButton` | `show-clear-button` | `"always" \| "focus" \| "never"` | `'always'` | Sets the behavior for the clear button. Defaults to `"focus"`. Setting to `"focus"` shows the clear button on focus if the input is not empty. Setting to `"never"` hides the clear button. Setting to `"always"` shows the clear button regardless of focus state, but only if the input is not empty. |
| `spellcheck` | `spellcheck` | `boolean` | `false` | If `true`, enable spellcheck on the input. |
| `type` | `type` | `"email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'search'` | Set the type of the input. |
| `value` | `value` | `null \| string \| undefined` | `''` | the value of the searchbar. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the input loses focus. |
| `ionCancel` | `void` | Emitted when the cancel button is clicked. |
| `ionChange` | `SearchbarChangeEventDetail` | The `ionChange` event is fired for `<ion-searchbar>` elements when the user modifies the element's value. Unlike the `ionInput` event, the `ionChange` event is not necessarily fired for each alteration to an element's value.  The `ionChange` event is fired when the value has been committed by the user. This can happen when the element loses focus or when the "Enter" key is pressed. `ionChange` can also fire when clicking the clear or cancel buttons.  This event will not emit when programmatically setting the `value` property. |
| `ionClear` | `void` | Emitted when the clear input button is clicked. |
| `ionFocus` | `void` | Emitted when the input has focus. |
| `ionInput` | `SearchbarInputEventDetail` | Emitted when the `value` of the `ion-searchbar` element has changed. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getInputElement` | `getInputElement() => Promise<HTMLInputElement>` | Returns the native `<input>` element used under the hood. |
| `setFocus` | `setFocus() => Promise<void>` | Sets focus on the native `input` in `ion-searchbar`. Use this method instead of the global `input.focus()`. Developers who wish to focus an input when a page enters should call `setFocus()` in the `ionViewDidEnter()` lifecycle method. Developers who wish to focus an input when an overlay is presented should call `setFocus` after `didPresent` has resolved.  See [managing focus](/docs/developing/managing-focus) for more information. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the searchbar input |
| `--border-radius` | Border radius of the searchbar input |
| `--box-shadow` | Box shadow of the searchbar input |
| `--cancel-button-color` | Color of the searchbar cancel button |
| `--clear-button-color` | Color of the searchbar clear button |
| `--color` | Color of the searchbar text |
| `--icon-color` | Color of the searchbar icon |
| `--placeholder-color` | Color of the searchbar placeholder |
| `--placeholder-font-style` | Font style of the searchbar placeholder |
| `--placeholder-font-weight` | Font weight of the searchbar placeholder |
| `--placeholder-opacity` | Opacity of the searchbar placeholder |

## Renders sub-components

`ion-icon`
