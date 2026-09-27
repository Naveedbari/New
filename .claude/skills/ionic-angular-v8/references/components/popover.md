# ion-popover

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonPopover, PopoverController } from '@ionic/angular/standalone';
```

Add `IonPopover` to the component's `imports: []` array.

Inject `PopoverController` via constructor DI to present `ion-popover` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` | `"center" \| "end" \| "start" \| undefined` |  | Describes how to align the popover content with the `reference` point. Defaults to `"center"` for `ios` mode, and `"start"` for `md` mode. |
| `animated` | `animated` | `boolean` | `true` | If `true`, the popover will animate. |
| `arrow` | `arrow` | `boolean` | `true` | If `true`, the popover will display an arrow that points at the `reference` when running in `ios` mode. Does not apply in `md` mode. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | If `true`, the popover will be dismissed when the backdrop is clicked. |
| `component` | `component` | `Function \| HTMLElement \| null \| string \| undefined` |  | The component to display inside of the popover. You only need to use this if you are not using a JavaScript framework. Otherwise, you can just slot your component inside of `ion-popover`. |
| `componentProps` |  | `T \| undefined` |  | The data to pass to the popover component. You only need to use this if you are not using a JavaScript framework. Otherwise, you can just set the props directly on your component. |
| `dismissOnSelect` | `dismiss-on-select` | `boolean` | `false` | If `true`, the popover will be automatically dismissed when the content has been clicked. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the popover is presented. |
| `event` | `event` | `any` |  | The event to pass to the popover animation. |
| `focusTrap` | `focus-trap` | `boolean` | `true` | If `true`, focus will not be allowed to move outside of this overlay. If `false`, focus will be allowed to move outside of the overlay.  In most scenarios this property should remain set to `true`. Setting this property to `false` can cause severe accessibility issues as users relying on assistive technologies may be able to move focus into a confusing state. We recommend only setting this to `false` when absolutely necessary.  Developers may want to consider disabling focus trapping if this overlay presents a non-Ionic overlay from a 3rd party library. Developers would disable focus trapping on the Ionic overlay when presenting the 3rd party overlay and then re-enable focus trapping when dismissing the 3rd party overlay and moving focus back to the Ionic overlay. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the popover. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the popover will open. If `false`, the popover will close. Use this if you need finer grained control over presentation, otherwise just use the popoverController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the popover dismisses. You will need to do that in your code. |
| `keepContentsMounted` | `keep-contents-mounted` | `boolean` | `false` | If `true`, the component passed into `ion-popover` will automatically be mounted when the popover is created. The component will remain mounted even when the popover is dismissed. However, the component will be destroyed when the popover is destroyed. This property is not reactive and should only be used when initially creating a popover.  Note: This feature only applies to inline popovers in JavaScript frameworks such as Angular, React, and Vue. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the popover is dismissed. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `reference` | `reference` | `"event" \| "trigger"` | `'trigger'` | Describes what to position the popover relative to. If `"trigger"`, the popover will be positioned relative to the trigger button. If passing in an event, this is determined via event.target. If `"event"`, the popover will be positioned relative to the x/y coordinates of the trigger action. If passing in an event, this is determined via event.clientX and event.clientY. |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | If `true`, a backdrop will be displayed behind the popover. This property controls whether or not the backdrop darkens the screen when the popover is presented. It does not control whether or not the backdrop is active or present in the DOM. |
| `side` | `side` | `"bottom" \| "end" \| "left" \| "right" \| "start" \| "top"` | `'bottom'` | Describes which side of the `reference` point to position the popover on. The `"start"` and `"end"` values are RTL-aware, and the `"left"` and `"right"` values are not. |
| `size` | `size` | `"auto" \| "cover"` | `'auto'` | Describes how to calculate the popover width. If `"cover"`, the popover width will match the width of the trigger. If `"auto"`, the popover width will be set to a static default value. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the popover will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the popover to open. Use the `trigger-action` property to customize the interaction that results in the popover opening. |
| `triggerAction` | `trigger-action` | `"click" \| "context-menu" \| "hover"` | `'click'` | Describes what kind of interaction with the trigger that should cause the popover to open. Does not apply when the `trigger` property is `undefined`. If `"click"`, the popover will be presented when the trigger is left clicked. If `"hover"`, the popover will be presented when a pointer hovers over the trigger. If `"context-menu"`, the popover will be presented when the trigger is right clicked on desktop and long pressed on mobile. This will also prevent your device's normal context menu from appearing. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the popover has dismissed. Shorthand for ionPopoverDidDismiss. |
| `didPresent` | `void` | Emitted after the popover has presented. Shorthand for ionPopoverWillDismiss. |
| `ionPopoverDidDismiss` | `OverlayEventDetail<any>` | Emitted after the popover has dismissed. |
| `ionPopoverDidPresent` | `void` | Emitted after the popover has presented. |
| `ionPopoverWillDismiss` | `OverlayEventDetail<any>` | Emitted before the popover has dismissed. |
| `ionPopoverWillPresent` | `void` | Emitted before the popover has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the popover has dismissed. Shorthand for ionPopoverWillDismiss. |
| `willPresent` | `void` | Emitted before the popover has presented. Shorthand for ionPopoverWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string, dismissParentPopover?: boolean) => Promise<boolean>` | Dismiss the popover overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the popover did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the popover will dismiss. |
| `present` | `present(event?: MouseEvent \| TouchEvent \| PointerEvent \| CustomEvent) => Promise<void>` | Present the popover overlay after it has been created. Developers can pass a mouse, touch, or pointer event to position the popover relative to where that event was dispatched. |

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed inside of the `.popover-content` element. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `arrow` | The arrow that points to the reference element. Only applies on `ios` mode. |
| `backdrop` | The `ion-backdrop` element. |
| `content` | The wrapper element for the default slot. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the popover |
| `--box-shadow` | Box shadow of the popover |
| `--height` | Height of the popover |
| `--max-height` | Maximum height of the popover |
| `--max-width` | Maximum width of the popover |
| `--min-height` | Minimum height of the popover |
| `--min-width` | Minimum width of the popover |
| `--offset-x` | The amount to move the popover by on the x-axis |
| `--offset-y` | The amount to move the popover by on the y-axis |
| `--width` | Width of the popover |

## Renders sub-components

`ion-backdrop`
