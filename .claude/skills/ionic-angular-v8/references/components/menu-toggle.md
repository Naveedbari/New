# ion-menu-toggle

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonMenuToggle } from '@ionic/angular/standalone';
```

Add `IonMenuToggle` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `autoHide` | `auto-hide` | `boolean` | `true` | Automatically hides the content when the corresponding menu is not active.  By default, it's `true`. Change it to `false` in order to keep `ion-menu-toggle` always visible regardless the state of the menu. |
| `menu` | `menu` | `string \| undefined` |  | Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle.  If this property is not used, `ion-menu-toggle` will toggle the first menu that is active. |

## Events

_None._

## Methods

_None._

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed inside the toggle to act as the click target. |

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
