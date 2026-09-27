# ion-item

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonItem } from '@ionic/angular/standalone';
```

Add `IonItem` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `button` | `button` | `boolean` | `false` | If `true`, a button tag will be rendered and the item will be tappable. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `detail` | `detail` | `boolean \| undefined` |  | If `true`, a detail arrow will appear on the item. Defaults to `false` unless the `mode` is `ios` and an `href` or `button` property is present. |
| `detailIcon` | `detail-icon` | `string` | `chevronForward` | The icon to use when `detail` is set to `true`. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the item. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `lines` | `lines` | `"full" \| "inset" \| "none" \| undefined` |  | How the bottom border should be displayed on the item. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | When using a router, it specifies the transition animation when navigating to another page using `href`. |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | When using a router, it specifies the transition direction when navigating to another page using `href`. |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | The type of the button. Only used when an `onclick` or `button` property is present. |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `end` | Content is placed to the right of the item text in LTR, and to the left in RTL. |
| `start` | Content is placed to the left of the item text in LTR, and to the right in RTL. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `container` | The wrapper element that contains the default slot. |
| `detail-icon` | The chevron icon for the item. Only applies when `detail="true"`. |
| `inner` | The inner wrapper element that arranges the item content. |
| `native` | The native HTML button, anchor or div element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the item |
| `--background-activated` | Background of the item when pressed. Note: setting this will interfere with the Material Design ripple. |
| `--background-activated-opacity` | Opacity of the item background when pressed |
| `--background-focused` | Background of the item when focused with the tab key |
| `--background-focused-opacity` | Opacity of the item background when focused with the tab key |
| `--background-hover` | Background of the item on hover |
| `--background-hover-opacity` | Opacity of the background of the item on hover |
| `--border-color` | Color of the item border |
| `--border-radius` | Radius of the item border |
| `--border-style` | Style of the item border |
| `--border-width` | Width of the item border |
| `--color` | Color of the item |
| `--color-activated` | Color of the item when pressed |
| `--color-focused` | Color of the item when focused with the tab key |
| `--color-hover` | Color of the item on hover |
| `--detail-icon-color` | Color of the item detail icon |
| `--detail-icon-font-size` | Font size of the item detail icon |
| `--detail-icon-opacity` | Opacity of the item detail icon |
| `--inner-border-width` | Width of the item inner border |
| `--inner-box-shadow` | Box shadow of the item inner |
| `--inner-padding-bottom` | Bottom padding of the item inner |
| `--inner-padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item inner |
| `--inner-padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item inner |
| `--inner-padding-top` | Top padding of the item inner |
| `--min-height` | Minimum height of the item |
| `--padding-bottom` | Bottom padding of the item |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item |
| `--padding-top` | Top padding of the item |
| `--ripple-color` | Color of the item ripple effect |
| `--transition` | Transition of the item |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`
