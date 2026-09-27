# ion-item-divider

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonItemDivider } from '@ionic/angular/standalone';
```

Add `IonItemDivider` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `sticky` | `sticky` | `boolean` | `false` | When it's set to `true`, the item-divider will stay visible when it reaches the top of the viewport until the next `ion-item-divider` replaces it.  This feature relies in `position:sticky`: https://caniuse.com/#feat=css-sticky |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `end` | Content is placed to the right of the divider text in LTR, and to the left in RTL. |
| `start` | Content is placed to the left of the divider text in LTR, and to the right in RTL. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `container` | The wrapper element that contains the default slot. |
| `inner` | The inner wrapper element that arranges the divider content. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the item divider |
| `--color` | Color of the item divider |
| `--inner-padding-bottom` | Bottom inner padding of the item divider |
| `--inner-padding-end` | End inner padding of the item divider |
| `--inner-padding-start` | Start inner padding of the item divider |
| `--inner-padding-top` | Top inner padding of the item divider |
| `--padding-bottom` | Bottom padding of the item divider |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item divider |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item divider |
| `--padding-top` | Top padding of the item divider |
