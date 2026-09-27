# ion-item-option

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonItemOption } from '@ionic/angular/standalone';
```

Add `IonItemOption` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the item option. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `expandable` | `expandable` | `boolean` | `false` | If `true`, the option will expand to take up the available width and cover any other options. |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | The type of the button. |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `bottom` | Content is placed below the option text. |
| `end` | Content is placed to the right of the option text in LTR, and to the left in RTL. |
| `icon-only` | Should be used on an icon in an option that has no text. |
| `start` | Content is placed to the left of the option text in LTR, and to the right in RTL. |
| `top` | Content is placed above the option text. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `container` | The container element that wraps the start, icon-only, default, and end slots. |
| `inner` | The inner wrapper element that arranges the option content. |
| `native` | The native HTML button or anchor element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the item option |
| `--color` | Color of the item option |

## Renders sub-components

`ion-ripple-effect`
