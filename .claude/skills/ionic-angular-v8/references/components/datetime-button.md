# ion-datetime-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonDatetimeButton } from '@ionic/angular/standalone';
```

Add `IonDatetimeButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` | `'primary'` | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `datetime` | `datetime` | `string \| undefined` |  | The ID of the `ion-datetime` instance associated with the datetime button. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the button. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `date-target` | Content displayed inside of the date button. |
| `time-target` | Content displayed inside of the time button. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `native` | The native HTML button that wraps the slotted text. |

## CSS Custom Properties

_None._

## Renders sub-components

`ion-ripple-effect`
