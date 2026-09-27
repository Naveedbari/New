# ion-router-link

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonRouterLink } from '@ionic/angular/standalone';
```

Add `IonRouterLink` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | When using a router, it specifies the transition animation when navigating to another page using `href`. |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | When using a router, it specifies the transition direction when navigating to another page using `href`. |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the router link |
| `--color` | Text color of the router link |
