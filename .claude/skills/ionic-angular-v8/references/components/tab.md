# ion-tab

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonTab } from '@ionic/angular/standalone';
```

Add `IonTab` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `component` | `component` | `Function \| HTMLElement \| null \| string \| undefined` |  | The component to display inside of the tab. |
| `tab` | `tab` | `string` |  | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them. |

## Events

_None._

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `setActive` | `setActive() => Promise<void>` | Set the active component for the tab |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
