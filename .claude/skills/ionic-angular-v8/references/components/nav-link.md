# ion-nav-link

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonNavLink } from '@ionic/angular/standalone';
```

Add `IonNavLink` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `component` | `component` | `Function \| HTMLElement \| ViewController \| null \| string \| undefined` |  | Component to navigate to. Only used if the `routerDirection` is `"forward"` or `"root"`. |
| `componentProps` |  | `T \| undefined` |  | Data you want to pass to the component as props. Only used if the `"routerDirection"` is `"forward"` or `"root"`. |
| `routerAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | The transition animation when navigating to another page. |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | The transition direction when navigating to another page. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
