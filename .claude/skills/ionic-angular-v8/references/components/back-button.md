# ion-back-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonBackButton } from '@ionic/angular/standalone';
```

Add `IonBackButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `defaultHref` | `default-href` | `string \| undefined` |  | The url to navigate back to by default when there is no history. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the button. |
| `icon` | `icon` | `null \| string \| undefined` |  | The built-in named SVG icon name or the exact `src` of an SVG file to use for the back button. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | When using a router, it specifies the transition animation when navigating to another page. |
| `text` | `text` | `null \| string \| undefined` |  | The text to display in the back button. |
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
| `icon` | The back button icon (uses ion-icon). |
| `native` | The native HTML button element that wraps all child elements. |
| `text` | The back button text. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the button |
| `--background-focused` | Background of the button when focused with the tab key |
| `--background-focused-opacity` | Opacity of the button background when focused with the tab key |
| `--background-hover` | Background of the button on hover |
| `--background-hover-opacity` | Opacity of the background on hover |
| `--border-radius` | Border radius of the button |
| `--color` | Text color of the button |
| `--color-focused` | Text color of the button when focused with the tab key |
| `--color-hover` | Text color of the button on hover |
| `--icon-font-size` | Font size of the button icon |
| `--icon-font-weight` | Font weight of the button icon |
| `--icon-margin-bottom` | Bottom margin of the button icon |
| `--icon-margin-end` | Right margin if direction is left-to-right, and left margin if direction is right-to-left of the button icon |
| `--icon-margin-start` | Left margin if direction is left-to-right, and right margin if direction is right-to-left of the button icon |
| `--icon-margin-top` | Top margin of the button icon |
| `--icon-padding-bottom` | Bottom padding of the button icon |
| `--icon-padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the button icon |
| `--icon-padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the button icon |
| `--icon-padding-top` | Top padding of the button icon |
| `--margin-bottom` | Bottom margin of the button |
| `--margin-end` | Right margin if direction is left-to-right, and left margin if direction is right-to-left of the button |
| `--margin-start` | Left margin if direction is left-to-right, and right margin if direction is right-to-left of the button |
| `--margin-top` | Top margin of the button |
| `--min-height` | Minimum height of the button |
| `--min-width` | Minimum width of the button |
| `--opacity` | Opacity of the button |
| `--padding-bottom` | Bottom padding of the button |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the button |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the button |
| `--padding-top` | Top padding of the button |
| `--ripple-color` | Color of the button ripple effect |
| `--transition` | Transition of the button |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`
