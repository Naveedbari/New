# ion-list-header

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonListHeader } from '@ionic/angular/standalone';
```

Add `IonListHeader` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `lines` | `lines` | `"full" \| "inset" \| "none" \| undefined` |  | How the bottom border should be displayed on the list header. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `inner` | The inner wrapper element that arranges the list header content. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the list header |
| `--border-color` | Color of the list header border |
| `--border-style` | Style of the list header border |
| `--border-width` | Width of the list header border |
| `--color` | Color of the list header text |
| `--inner-border-width` | Width of the inner list header border |
