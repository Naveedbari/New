# ion-accordion-group

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonAccordionGroup } from '@ionic/angular/standalone';
```

Add `IonAccordionGroup` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, all accordions inside of the accordion group will animate when expanding or collapsing. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the accordion group cannot be interacted with. |
| `expand` | `expand` | `"compact" \| "inset"` | `'compact'` | Describes the expansion behavior for each accordion. Possible values are `"compact"` and `"inset"`. Defaults to `"compact"`. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `multiple` | `multiple` | `boolean \| undefined` |  | If `true`, the accordion group can have multiple accordion components expanded at the same time. |
| `readonly` | `readonly` | `boolean` | `false` | If `true`, the accordion group cannot be interacted with, but does not alter the opacity. |
| `value` | `value` | `null \| string \| string[] \| undefined` |  | The value of the accordion group. This controls which accordions are expanded. This should be an array of strings only when `multiple="true"` |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionChange` | `AccordionGroupChangeEventDetail<any>` | Emitted when the value property has changed as a result of a user action such as a click.  This event will not emit when programmatically setting the `value` property. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
