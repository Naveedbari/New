# ion-toolbar

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonToolbar } from '@ionic/angular/standalone';
```

Add `IonToolbar` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed between the named slots if provided without a slot. |
| `end` | Content is placed to the right of the toolbar text in LTR, and to the left in RTL. |
| `primary` | Content is placed to the right of the toolbar text in `ios` mode, and to the far right in `md` mode. |
| `secondary` | Content is placed to the left of the toolbar text in `ios` mode, and directly to the right in `md` mode. |
| `start` | Content is placed to the left of the toolbar text in LTR, and to the right in RTL. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `background` | The background of the toolbar, covering the entire area behind the toolbar content. |
| `container` | The container that wraps all toolbar content, including the default slot and named slot content. |
| `content` | The container for the default slot, wrapping content provided without a named slot. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the toolbar |
| `--border-color` | Color of the toolbar border |
| `--border-style` | Style of the toolbar border |
| `--border-width` | Width of the toolbar border |
| `--color` | Color of the toolbar text |
| `--min-height` | Minimum height of the toolbar |
| `--opacity` | Opacity of the toolbar background |
| `--padding-bottom` | Bottom padding of the toolbar |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the toolbar |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the toolbar |
| `--padding-top` | Top padding of the toolbar |
