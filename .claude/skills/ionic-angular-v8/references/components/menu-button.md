# ion-menu-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonMenuButton } from '@ionic/angular/standalone';
```

Add `IonMenuButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `autoHide` | `auto-hide` | `boolean` | `true` | Automatically hides the menu button when the corresponding menu is not active |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the menu button. |
| `menu` | `menu` | `string \| undefined` |  | Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | The type of the button. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `icon` | The menu button icon (uses ion-icon). |
| `native` | The native HTML button element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the menu button |
| `--background-focused` | Background of the menu button when focused with the tab key |
| `--background-focused-opacity` | Opacity of the menu button background when focused with the tab key |
| `--background-hover` | Background of the menu button on hover |
| `--background-hover-opacity` | Opacity of the background on hover |
| `--border-radius` | Border radius of the menu button |
| `--color` | Color of the menu button |
| `--color-focused` | Color of the menu button when focused with the tab key |
| `--color-hover` | Color of the menu button on hover |
| `--padding-bottom` | Bottom padding of the button |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the button |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the button |
| `--padding-top` | Top padding of the button |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`
