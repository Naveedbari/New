# ion-card

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonCard } from '@ionic/angular/standalone';
```

Add `IonCard` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `button` | `button` | `boolean` | `false` | If `true`, a button tag will be rendered and the card will be tappable. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the card. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
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

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `native` | The native HTML button, anchor, or div element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the card |
| `--color` | Color of the card |

## Renders sub-components

`ion-ripple-effect`
