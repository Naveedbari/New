# ion-toast

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonToast, ToastController } from '@ionic/angular/standalone';
```

Add `IonToast` to the component's `imports: []` array.

Inject `ToastController` via constructor DI to present `ion-toast` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the toast will animate. |
| `buttons` |  | `(string \| ToastButton)[] \| undefined` |  | An array of buttons for the toast. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `cssClass` | `css-class` | `string \| string[] \| undefined` |  | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. |
| `duration` | `duration` | `number` | `config.getNumber('toastDuration', 0)` | How many milliseconds to wait before hiding the toast. By default, it will show until `dismiss()` is called. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the toast is presented. |
| `header` | `header` | `string \| undefined` |  | Header to be shown in the toast. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the toast. |
| `icon` | `icon` | `string \| undefined` |  | The name of the icon to display, or the path to a valid SVG file. See `ion-icon`. https://ionic.io/ionicons |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the toast will open. If `false`, the toast will close. Use this if you need finer grained control over presentation, otherwise just use the toastController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the toast dismisses. You will need to do that in your code. |
| `keyboardClose` | `keyboard-close` | `boolean` | `false` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `layout` | `layout` | `"baseline" \| "stacked"` | `'baseline'` | Defines how the message and buttons are laid out in the toast. 'baseline': The message and the buttons will appear on the same line. Message text may wrap within the message container. 'stacked': The buttons containers and message will stack on top of each other. Use this if you have long text in your buttons. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the toast is dismissed. |
| `message` | `message` | `IonicSafeString \| string \| undefined` |  | Message to be shown in the toast. This property accepts custom HTML as a string. Content is parsed as plaintext by default. `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config before custom HTML can be used. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `position` | `position` | `"bottom" \| "middle" \| "top"` | `'bottom'` | The starting position of the toast on the screen. Can be tweaked further using the `positionAnchor` property. |
| `positionAnchor` | `position-anchor` | `HTMLElement \| string \| undefined` |  | The element to anchor the toast's position to. Can be set as a direct reference or the ID of the element. With `position="bottom"`, the toast will sit above the chosen element. With `position="top"`, the toast will sit below the chosen element. With `position="middle"`, the value of `positionAnchor` is ignored. |
| `swipeGesture` | `swipe-gesture` | `"vertical" \| undefined` |  | If set to 'vertical', the Toast can be dismissed with a swipe gesture. The swipe direction is determined by the value of the `position` property: `top`: The Toast can be swiped up to dismiss. `bottom`: The Toast can be swiped down to dismiss. `middle`: The Toast can be swiped up or down to dismiss. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the toast will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the toast to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the toast has dismissed. Shorthand for ionToastDidDismiss. |
| `didPresent` | `void` | Emitted after the toast has presented. Shorthand for ionToastWillDismiss. |
| `ionToastDidDismiss` | `OverlayEventDetail<any>` | Emitted after the toast has dismissed. |
| `ionToastDidPresent` | `void` | Emitted after the toast has presented. |
| `ionToastWillDismiss` | `OverlayEventDetail<any>` | Emitted before the toast has dismissed. |
| `ionToastWillPresent` | `void` | Emitted before the toast has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the toast has dismissed. Shorthand for ionToastWillDismiss. |
| `willPresent` | `void` | Emitted before the toast has presented. Shorthand for ionToastWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the toast overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the toast did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the toast will dismiss. |
| `present` | `present() => Promise<void>` | Present the toast overlay after it has been created. |

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `button` | Any button element that is displayed inside of the toast. |
| `button cancel` | Any button element with role "cancel" that is displayed inside of the toast. |
| `container` | Groups the icon, content, and buttons. |
| `content` | The live region that contains the header and message. |
| `header` | The header text of the toast. |
| `icon` | The icon that appears next to the toast content. |
| `message` | The body text of the toast. |
| `wrapper` | The outer wrapper for the toast overlay. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the toast |
| `--border-color` | Border color of the toast |
| `--border-radius` | Border radius of the toast |
| `--border-style` | Border style of the toast |
| `--border-width` | Border width of the toast |
| `--box-shadow` | Box shadow of the toast |
| `--button-color` | Color of the button text |
| `--color` | Color of the toast text |
| `--end` | Position from the right if direction is left-to-right, and from the left if direction is right-to-left |
| `--height` | Height of the toast |
| `--max-height` | Maximum height of the toast |
| `--max-width` | Maximum width of the toast |
| `--min-height` | Minimum height of the toast |
| `--min-width` | Minimum width of the toast |
| `--start` | Position from the left if direction is left-to-right, and from the right if direction is right-to-left |
| `--white-space` | White space of the toast message |
| `--width` | Width of the toast |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`
