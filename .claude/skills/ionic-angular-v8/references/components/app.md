# ion-app

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonApp } from '@ionic/angular/standalone';
```

Add `IonApp` to the component's `imports: []` array.

## Properties

_None._

## Events

_None._

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `setFocus` | `setFocus(elements: HTMLElement[]) => Promise<void>` | Used to set focus on an element that uses `ion-focusable`. Do not use this if focusing the element as a result of a keyboard event as the focus utility should handle this for us. This method should be used when we want to programmatically focus an element as a result of another user action. (Ex: We focus the first element inside of a popover when the user presents it, but the popover is not always presented as a result of keyboard action.) |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
