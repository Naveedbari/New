# ion-fab-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonFabButton } from '@ionic/angular/standalone';
```

Add `IonFabButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `activated` | `activated` | `boolean` | `false` | If `true`, the fab button will be show a close icon. |
| `closeIcon` | `close-icon` | `string` | `close` | The icon name to use for the close icon. This will appear when the fab button is pressed. Only applies if it is the main button inside of a fab containing a fab list. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the fab button. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | When using a router, it specifies the transition animation when navigating to another page using `href`. |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | When using a router, it specifies the transition direction when navigating to another page using `href`. |
| `show` | `show` | `boolean` | `false` | If `true`, the fab button will show when in a fab-list. |
| `size` | `size` | `"small" \| undefined` |  | The size of the button. Set this to `small` in order to have a mini fab button. |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the fab button will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | The type of the button. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the button loses focus. |
| `ionFocus` | `void` | Emitted when the button has focus. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `close-icon` | The close icon that is displayed when a fab list opens (uses ion-icon). |
| `native` | The native HTML button or anchor element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the button |
| `--background-activated` | Background of the button when pressed. Note: setting this will interfere with the Material Design ripple. |
| `--background-activated-opacity` | Opacity of the button background when pressed |
| `--background-focused` | Background of the button when focused with the tab key |
| `--background-focused-opacity` | Opacity of the button background when focused with the tab key |
| `--background-hover` | Background of the button on hover |
| `--background-hover-opacity` | Opacity of the button background on hover |
| `--border-color` | Border color of the button |
| `--border-radius` | Border radius of the button |
| `--border-style` | Border style of the button |
| `--border-width` | Border width of the button |
| `--box-shadow` | Box shadow of the button |
| `--close-icon-font-size` | Font size of the close icon |
| `--color` | Text color of the button |
| `--color-activated` | Text color of the button when pressed |
| `--color-focused` | Text color of the button when focused with the tab key |
| `--color-hover` | Text color of the button on hover |
| `--padding-bottom` | Bottom padding of the button |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the button |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the button |
| `--padding-top` | Top padding of the button |
| `--ripple-color` | Color of the button ripple effect |
| `--transition` | Transition of the button |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`
