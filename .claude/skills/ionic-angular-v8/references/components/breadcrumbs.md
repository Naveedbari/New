# ion-breadcrumbs

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonBreadcrumbs } from '@ionic/angular/standalone';
```

Add `IonBreadcrumbs` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `itemsAfterCollapse` | `items-after-collapse` | `number` | `1` | The number of breadcrumbs to show after the collapsed indicator. If `itemsBeforeCollapse` + `itemsAfterCollapse` is greater than `maxItems`, the breadcrumbs will not be collapsed. |
| `itemsBeforeCollapse` | `items-before-collapse` | `number` | `1` | The number of breadcrumbs to show before the collapsed indicator. If `itemsBeforeCollapse` + `itemsAfterCollapse` is greater than `maxItems`, the breadcrumbs will not be collapsed. |
| `maxItems` | `max-items` | `number \| undefined` |  | The maximum number of breadcrumbs to show before collapsing. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionCollapsedClick` | `BreadcrumbCollapsedClickEventDetail` | Emitted when the collapsed indicator is clicked on. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
