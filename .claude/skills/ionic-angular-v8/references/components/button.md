# ion-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonButton } from '@ionic/angular/standalone';
```

Add `IonButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `buttonType` | `button-type` | `string` | `'button'` | The type of button. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the button. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `expand` | `expand` | `"block" \| "full" \| undefined` |  | Set to `"block"` for a full-width button or to `"full"` for a full-width button with square corners and no left or right borders. |
| `fill` | `fill` | `"clear" \| "default" \| "outline" \| "solid" \| undefined` |  | Set to `"clear"` for a transparent button that resembles a flat button, to `"outline"` for a transparent button with a border, or to `"solid"` for a button with a filled background. The default fill is `"solid"` except inside of a toolbar, where the default is `"clear"`. |
| `form` | `form` | `HTMLFormElement \| string \| undefined` |  | The HTML form element or form element id. Used to submit a form when the button is not a child of the form. |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | When using a router, it specifies the transition animation when navigating to another page using `href`. |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | When using a router, it specifies the transition direction when navigating to another page using `href`. |
| `shape` | `shape` | `"round" \| undefined` |  | Set to `"round"` for a button with more rounded corners. |
| `size` | `size` | `"default" \| "large" \| "small" \| undefined` |  | Set to `"small"` for a button with less height and padding, to `"default"` for a button with the default height and padding, or to `"large"` for a button with more height and padding. By default the size is unset, unless the button is inside of an item, where the size is `"small"` by default. Set the size to `"default"` inside of an item to make it a standard size button. |
| `strong` | `strong` | `boolean` | `false` | If `true`, activates a button with a heavier font weight. |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | The type of the button. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the button loses focus. |
| `ionFocus` | `void` | Emitted when the button has focus. |

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `end` | Content is placed to the right of the button text in LTR, and to the left in RTL. |
| `icon-only` | Should be used on an icon in a button that has no text. |
| `start` | Content is placed to the left of the button text in LTR, and to the right in RTL. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `native` | The native HTML button or anchor element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the button |
| `--background-activated` | Background of the button when pressed. Note: setting this will interfere with the Material Design ripple. |
| `--background-activated-opacity` | Opacity of the button when pressed |
| `--background-focused` | Background of the button when focused with the tab key |
| `--background-focused-opacity` | Opacity of the button when focused with the tab key |
| `--background-hover` | Background of the button on hover |
| `--background-hover-opacity` | Opacity of the background on hover |
| `--border-color` | Border color of the button |
| `--border-radius` | Border radius of the button |
| `--border-style` | Border style of the button |
| `--border-width` | Border width of the button |
| `--box-shadow` | Box shadow of the button |
| `--color` | Text color of the button |
| `--color-activated` | Text color of the button when pressed |
| `--color-focused` | Text color of the button when focused with the tab key |
| `--color-hover` | Text color of the button when hover |
| `--opacity` | Opacity of the button |
| `--padding-bottom` | Bottom padding of the button |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the button |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the button |
| `--padding-top` | Top padding of the button |
| `--ripple-color` | Color of the button ripple effect |
| `--transition` | Transition of the button |

## Renders sub-components

`ion-ripple-effect`
