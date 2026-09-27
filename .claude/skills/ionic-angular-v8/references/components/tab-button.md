# ion-tab-button

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonTabButton } from '@ionic/angular/standalone';
```

Add `IonTabButton` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the tab button. |
| `download` | `download` | `string \| undefined` |  | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). |
| `href` | `href` | `string \| undefined` |  | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered. |
| `layout` | `layout` | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide" \| undefined` |  | Set the layout of the text and icon in the tab bar. It defaults to `"icon-top"`. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `rel` | `rel` | `string \| undefined` |  | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types). |
| `selected` | `selected` | `boolean` | `false` | The selected tab component |
| `tab` | `tab` | `string \| undefined` |  | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them. |
| `target` | `target` | `string \| undefined` |  | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `native` | The native HTML anchor element that wraps all child elements. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the tab button |
| `--background-focused` | Background of the tab button when focused with the tab key |
| `--background-focused-opacity` | Opacity of the tab button background when focused with the tab key |
| `--color` | Color of the tab button |
| `--color-focused` | Color of the tab button when focused with the tab key |
| `--color-selected` | Color of the selected tab button |
| `--padding-bottom` | Bottom padding of the tab button |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the tab button |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the tab button |
| `--padding-top` | Top padding of the tab button |
| `--ripple-color` | Color of the button ripple effect |

## Renders sub-components

`ion-ripple-effect`
