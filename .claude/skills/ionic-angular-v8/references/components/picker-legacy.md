# ion-picker-legacy

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonPickerLegacy } from '@ionic/angular/standalone';
```

Add `IonPickerLegacy` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the picker will animate. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | If `true`, the picker will be dismissed when the backdrop is clicked. |
| `buttons` |  | `PickerButton[]` | `[]` | Array of buttons to be displayed at the top of the picker. |
| `columns` |  | `PickerColumn[]` | `[]` | Array of columns to be displayed in the picker. |
| `cssClass` | `css-class` | `string \| string[] \| undefined` |  | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. |
| `duration` | `duration` | `number` | `0` | Number of milliseconds to wait before dismissing the picker. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the picker is presented. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the picker. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the picker will open. If `false`, the picker will close. Use this if you need finer grained control over presentation, otherwise just use the pickerController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the picker dismisses. You will need to do that in your code. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the picker is dismissed. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | If `true`, a backdrop will be displayed behind the picker. |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the picker to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the picker has dismissed. Shorthand for ionPickerDidDismiss. |
| `didPresent` | `void` | Emitted after the picker has presented. Shorthand for ionPickerWillDismiss. |
| `ionPickerDidDismiss` | `OverlayEventDetail<any>` | Emitted after the picker has dismissed. |
| `ionPickerDidPresent` | `void` | Emitted after the picker has presented. |
| `ionPickerWillDismiss` | `OverlayEventDetail<any>` | Emitted before the picker has dismissed. |
| `ionPickerWillPresent` | `void` | Emitted before the picker has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the picker has dismissed. Shorthand for ionPickerWillDismiss. |
| `willPresent` | `void` | Emitted before the picker has presented. Shorthand for ionPickerWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the picker overlay after it has been presented. |
| `getColumn` | `getColumn(name: string) => Promise<PickerColumn \| undefined>` | Get the column that matches the specified name. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the picker did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the picker will dismiss. |
| `present` | `present() => Promise<void>` | Present the picker overlay after it has been created. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the picker |
| `--background-rgb` | Background of the picker in rgb format |
| `--border-color` | Border color of the picker |
| `--border-radius` | Border radius of the picker |
| `--border-style` | Border style of the picker |
| `--border-width` | Border width of the picker |
| `--height` | Height of the picker |
| `--max-height` | Maximum height of the picker |
| `--max-width` | Maximum width of the picker |
| `--min-height` | Minimum height of the picker |
| `--min-width` | Minimum width of the picker |
| `--width` | Width of the picker |

## Renders sub-components

`ion-backdrop`, `ion-picker-legacy-column`
