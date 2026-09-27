# ion-loading

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonLoading, LoadingController } from '@ionic/angular/standalone';
```

Add `IonLoading` to the component's `imports: []` array.

Inject `LoadingController` via constructor DI to present `ion-loading` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the loading indicator will animate. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `false` | If `true`, the loading indicator will be dismissed when the backdrop is clicked. |
| `cssClass` | `css-class` | `string \| string[] \| undefined` |  | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. |
| `duration` | `duration` | `number` | `0` | Number of milliseconds to wait before dismissing the loading indicator. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the loading indicator is presented. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the loader. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the loading indicator will open. If `false`, the loading indicator will close. Use this if you need finer grained control over presentation, otherwise just use the loadingController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the loading indicator dismisses. You will need to do that in your code. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the loading indicator is dismissed. |
| `message` | `message` | `IonicSafeString \| string \| undefined` |  | Optional text content to display in the loading indicator.  This property accepts custom HTML as a string. Content is parsed as plaintext by default. `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config before custom HTML can be used. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | If `true`, a backdrop will be displayed behind the loading indicator. |
| `spinner` | `spinner` | `"bubbles" \| "circles" \| "circular" \| "crescent" \| "dots" \| "lines" \| "lines-sharp" \| "lines-sharp-small" \| "lines-small" \| null \| undefined` |  | The name of the spinner to display. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the loading indicator will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the loading indicator to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the loading indicator has dismissed. Shorthand for ionLoadingDidDismiss. |
| `didPresent` | `void` | Emitted after the loading indicator has presented. Shorthand for ionLoadingWillDismiss. |
| `ionLoadingDidDismiss` | `OverlayEventDetail<any>` | Emitted after the loading has dismissed. |
| `ionLoadingDidPresent` | `void` | Emitted after the loading has presented. |
| `ionLoadingWillDismiss` | `OverlayEventDetail<any>` | Emitted before the loading has dismissed. |
| `ionLoadingWillPresent` | `void` | Emitted before the loading has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the loading indicator has dismissed. Shorthand for ionLoadingWillDismiss. |
| `willPresent` | `void` | Emitted before the loading indicator has presented. Shorthand for ionLoadingWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the loading overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the loading did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the loading will dismiss. |
| `present` | `present() => Promise<void>` | Present the loading overlay after it has been created. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the loading dialog |
| `--height` | Height of the loading dialog |
| `--max-height` | Maximum height of the loading dialog |
| `--max-width` | Maximum width of the loading dialog |
| `--min-height` | Minimum height of the loading dialog |
| `--min-width` | Minimum width of the loading dialog |
| `--spinner-color` | Color of the loading spinner |
| `--width` | Width of the loading dialog |

## Renders sub-components

`ion-backdrop`, `ion-spinner`
