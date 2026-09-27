# ion-radio-group

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonRadioGroup } from '@ionic/angular/standalone';
```

Add `IonRadioGroup` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `allowEmptySelection` | `allow-empty-selection` | `boolean` | `false` | If `true`, the radios can be deselected. |
| `compareWith` | `compare-with` | `((currentValue: any, compareValue: any) => boolean) \| null \| string \| undefined` |  | This property allows developers to specify a custom function or property name for comparing objects when determining the selected option in the ion-radio-group. When not specified, the default behavior will use strict equality (===) for comparison. |
| `errorText` | `error-text` | `string \| undefined` |  | The error text to display at the top of the radio group. |
| `helperText` | `helper-text` | `string \| undefined` |  | The helper text to display at the top of the radio group. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `value` | `value` | `any` |  | the value of the radio group. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionChange` | `RadioGroupChangeEventDetail<any>` | Emitted when the value has changed.  This event will not emit when programmatically setting the `value` property. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
