# ion-modal

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonModal, ModalController } from '@ionic/angular/standalone';
```

Add `IonModal` to the component's `imports: []` array.

Inject `ModalController` via constructor DI to present `ion-modal` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the modal will animate. |
| `backdropBreakpoint` | `backdrop-breakpoint` | `number` | `0` | A decimal value between 0 and 1 that indicates the point after which the backdrop will begin to fade in when using a sheet modal. Prior to this point, the backdrop will be hidden and the content underneath the sheet can be interacted with. This value is exclusive meaning the backdrop will become active after the value specified. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | If `true`, the modal will be dismissed when the backdrop is clicked. |
| `breakpoints` |  | `number[] \| undefined` |  | The breakpoints to use when creating a sheet modal. Each value in the array must be a decimal between 0 and 1 where 0 indicates the modal is fully closed and 1 indicates the modal is fully open. Values are relative to the height of the modal, not the height of the screen. One of the values in this array must be the value of the `initialBreakpoint` property. For example: [0, .25, .5, 1] |
| `canDismiss` | `can-dismiss` | `((data?: any, role?: string \| undefined) => Promise<boolean>) \| boolean` | `true` | Determines whether or not a modal can dismiss when calling the `dismiss` method.  If the value is `true` or the value's function returns `true`, the modal will close when trying to dismiss. If the value is `false` or the value's function returns `false`, the modal will not close when trying to dismiss.  See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this if you need to access `this` from within the callback. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the modal is presented. |
| `expandToScroll` | `expand-to-scroll` | `boolean` | `true` | Controls whether scrolling or dragging within the sheet modal expands it to a larger breakpoint. This only takes effect when `breakpoints` and `initialBreakpoint` are set.  If `true`, scrolling or dragging anywhere in the modal will first expand it to the next breakpoint. Once fully expanded, scrolling will affect the content. If `false`, scrolling will always affect the content. The modal will only expand when dragging the header or handle. The modal will close when dragging the header or handle. It can also be closed when dragging the content, but only if the content is scrolled to the top. |
| `focusTrap` | `focus-trap` | `boolean` | `true` | If `true`, focus will not be allowed to move outside of this overlay. If `false`, focus will be allowed to move outside of the overlay.  In most scenarios this property should remain set to `true`. Setting this property to `false` can cause severe accessibility issues as users relying on assistive technologies may be able to move focus into a confusing state. We recommend only setting this to `false` when absolutely necessary.  Developers may want to consider disabling focus trapping if this overlay presents a non-Ionic overlay from a 3rd party library. Developers would disable focus trapping on the Ionic overlay when presenting the 3rd party overlay and then re-enable focus trapping when dismissing the 3rd party overlay and moving focus back to the Ionic overlay. |
| `handle` | `handle` | `boolean \| undefined` |  | The horizontal line that displays at the top of a sheet modal. It is `true` by default when setting the `breakpoints` and `initialBreakpoint` properties. |
| `handleBehavior` | `handle-behavior` | `"cycle" \| "none" \| undefined` | `'none'` | The interaction behavior for the sheet modal when the handle is pressed.  Defaults to `"none"`, which  means the modal will not change size or position when the handle is pressed. Set to `"cycle"` to let the modal cycle between available breakpoints when pressed.  Handle behavior is unavailable when the `handle` property is set to `false` or when the `breakpoints` property is not set (using a fullscreen or card modal). |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the modal. |
| `initialBreakpoint` | `initial-breakpoint` | `number \| undefined` |  | A decimal value between 0 and 1 that indicates the initial point the modal will open at when creating a sheet modal. This value must also be listed in the `breakpoints` array. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the modal will open. If `false`, the modal will close. Use this if you need finer grained control over presentation, otherwise just use the modalController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the modal dismisses. You will need to do that in your code. |
| `keepContentsMounted` | `keep-contents-mounted` | `boolean` | `false` | If `true`, the component passed into `ion-modal` will automatically be mounted when the modal is created. The component will remain mounted even when the modal is dismissed. However, the component will be destroyed when the modal is destroyed. This property is not reactive and should only be used when initially creating a modal.  Note: This feature only applies to inline modals in JavaScript frameworks such as Angular, React, and Vue. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the modal is dismissed. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `presentingElement` |  | `HTMLElement \| undefined` |  | The element that presented the modal. This is used for card presentation effects and for stacking multiple modals on top of each other. Only applies in iOS mode. |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | If `true`, a backdrop will be displayed behind the modal. This property controls whether or not the backdrop darkens the screen when the modal is presented. It does not control whether or not the backdrop is active or present in the DOM. |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the modal to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the modal has dismissed. Shorthand for ionModalDidDismiss. |
| `didPresent` | `void` | Emitted after the modal has presented. Shorthand for ionModalDidPresent. |
| `ionBreakpointDidChange` | `ModalBreakpointChangeEventDetail` | Emitted after the modal breakpoint has changed. |
| `ionDragEnd` | `ModalDragEventDetail` | Event that is emitted when the sheet modal or card modal gesture ends. |
| `ionDragMove` | `ModalDragEventDetail` | Event that is emitted when the sheet modal or card modal gesture moves. |
| `ionDragStart` | `void` | Event that is emitted when the sheet modal or card modal gesture starts. |
| `ionModalDidDismiss` | `OverlayEventDetail<any>` | Emitted after the modal has dismissed. |
| `ionModalDidPresent` | `void` | Emitted after the modal has presented. |
| `ionModalWillDismiss` | `OverlayEventDetail<any>` | Emitted before the modal has dismissed. |
| `ionModalWillPresent` | `void` | Emitted before the modal has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the modal has dismissed. Shorthand for ionModalWillDismiss. |
| `willPresent` | `void` | Emitted before the modal has presented. Shorthand for ionModalWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the modal overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `getCurrentBreakpoint` | `getCurrentBreakpoint() => Promise<number \| undefined>` | Returns the current breakpoint of a sheet style modal |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the modal did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the modal will dismiss. |
| `present` | `present() => Promise<void>` | Present the modal overlay after it has been created. |
| `setCurrentBreakpoint` | `setCurrentBreakpoint(breakpoint: number) => Promise<void>` | Move a sheet style modal to a specific breakpoint. |

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed inside of the `.modal-content` element. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `backdrop` | The `ion-backdrop` element. |
| `content` | The wrapper element for the default slot. |
| `handle` | The handle that is displayed at the top of the sheet modal when `handle="true"`. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the modal content |
| `--border-color` | Border color of the modal content |
| `--border-radius` | Border radius of the modal content |
| `--border-style` | Border style of the modal content |
| `--border-width` | Border width of the modal content |
| `--height` | Height of the modal |
| `--max-height` | Maximum height of the modal |
| `--max-width` | Maximum width of the modal |
| `--min-height` | Minimum height of the modal |
| `--min-width` | Minimum width of the modal |
| `--width` | Width of the modal |

## Renders sub-components

`ion-backdrop`
