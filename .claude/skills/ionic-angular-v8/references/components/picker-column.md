# ion-picker-column

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonPickerColumn } from '@ionic/angular/standalone';
```

Add `IonPickerColumn` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` | `'primary'` | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the picker. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `value` | `value` | `number \| string \| undefined` |  | The selected option in the picker. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionChange` | `PickerColumnChangeEventDetail` | Emitted when the value has changed.  This event will not emit when programmatically setting the `value` property. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `setFocus` | `setFocus() => Promise<void>` | Sets focus on the scrollable container within the picker column. Use this method instead of the global `pickerColumn.focus()`. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Content to show on the left side of the picker options. |
| `suffix` | Content to show on the right side of the picker options. |

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
