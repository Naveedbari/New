# ion-menu

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonMenu, MenuController } from '@ionic/angular/standalone';
```

Add `IonMenu` to the component's `imports: []` array.

Inject `MenuController` via constructor DI to present `ion-menu` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `contentId` | `content-id` | `string \| undefined` |  | The `id` of the main content. When using a router this is typically `ion-router-outlet`. When not using a router, this is typically your main view's `ion-content`. This is not the id of the `ion-content` inside of your `ion-menu`. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the menu is disabled. |
| `maxEdgeStart` | `max-edge-start` | `number` | `50` | The edge threshold for dragging the menu open. If a drag/swipe happens over this value, the menu is not triggered. |
| `menuId` | `menu-id` | `string \| undefined` |  | An id for the menu. |
| `side` | `side` | `"end" \| "start"` | `'start'` | Which side of the view the menu should be placed. |
| `swipeGesture` | `swipe-gesture` | `boolean` | `true` | If `true`, swiping the menu is enabled. |
| `type` | `type` | `"overlay" \| "push" \| "reveal" \| undefined` |  | The display type of the menu. Available options: `"overlay"`, `"reveal"`, `"push"`. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionDidClose` | `MenuCloseEventDetail` | Emitted when the menu is closed. |
| `ionDidOpen` | `void` | Emitted when the menu is open. |
| `ionWillClose` | `MenuCloseEventDetail` | Emitted when the menu is about to be closed. |
| `ionWillOpen` | `void` | Emitted when the menu is about to be opened. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `close` | `close(animated?: boolean, role?: string) => Promise<boolean>` | Closes the menu. If the menu is already closed or it can't be closed, it returns `false`. |
| `isActive` | `isActive() => Promise<boolean>` | Returns `true` if the menu is active.  A menu is active when it can be opened or closed, meaning it's enabled and it's not part of a `ion-split-pane`. |
| `isOpen` | `isOpen() => Promise<boolean>` | Returns `true` is the menu is open. |
| `open` | `open(animated?: boolean) => Promise<boolean>` | Opens the menu. If the menu is already open or it can't be opened, it returns `false`. |
| `setOpen` | `setOpen(shouldOpen: boolean, animated?: boolean, role?: string) => Promise<boolean>` | Opens or closes the menu. If the operation can't be completed successfully, it returns `false`. |
| `toggle` | `toggle(animated?: boolean) => Promise<boolean>` | Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it. If the operation can't be completed successfully, it returns `false`. |

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `backdrop` | The backdrop that appears over the main content when the menu is open. |
| `container` | The container for the menu content. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the menu |
| `--height` | Height of the menu |
| `--max-height` | Maximum height of the menu |
| `--max-width` | Maximum width of the menu |
| `--min-height` | Minimum height of the menu |
| `--min-width` | Minimum width of the menu |
| `--width` | Width of the menu |

## Renders sub-components

`ion-backdrop`
