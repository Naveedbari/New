# ion-alert

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonAlert, AlertController } from '@ionic/angular/standalone';
```

Add `IonAlert` to the component's `imports: []` array.

Inject `AlertController` via constructor DI to present `ion-alert` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the alert will animate. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | If `true`, the alert will be dismissed when the backdrop is clicked. |
| `buttons` |  | `(string \| AlertButton)[]` | `[]` | Array of buttons to be added to the alert. |
| `cssClass` | `css-class` | `string \| string[] \| undefined` |  | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the alert is presented. |
| `header` | `header` | `string \| undefined` |  | The main title in the heading of the alert. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the alert. |
| `inputs` |  | `AlertInput[]` | `[]` | Array of input to show in the alert. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the alert will open. If `false`, the alert will close. Use this if you need finer grained control over presentation, otherwise just use the alertController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the alert dismisses. You will need to do that in your code. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the alert is dismissed. |
| `message` | `message` | `IonicSafeString \| string \| undefined` |  | The main message to be displayed in the alert. `message` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)  This property accepts custom HTML as a string. Content is parsed as plaintext by default. `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config before custom HTML can be used. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `subHeader` | `sub-header` | `string \| undefined` |  | The subtitle in the heading of the alert. Displayed under the title. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the alert will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the alert to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the alert has dismissed. Shorthand for ionAlertDidDismiss. |
| `didPresent` | `void` | Emitted after the alert has presented. Shorthand for ionAlertWillDismiss. |
| `ionAlertDidDismiss` | `OverlayEventDetail<any>` | Emitted after the alert has dismissed. |
| `ionAlertDidPresent` | `void` | Emitted after the alert has presented. |
| `ionAlertWillDismiss` | `OverlayEventDetail<any>` | Emitted before the alert has dismissed. |
| `ionAlertWillPresent` | `void` | Emitted before the alert has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the alert has dismissed. Shorthand for ionAlertWillDismiss. |
| `willPresent` | `void` | Emitted before the alert has presented. Shorthand for ionAlertWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the alert overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the alert did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the alert will dismiss. |
| `present` | `present() => Promise<void>` | Present the alert overlay after it has been created. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the alert |
| `--height` | Height of the alert |
| `--max-height` | Maximum height of the alert |
| `--max-width` | Maximum width of the alert |
| `--min-height` | Minimum height of the alert |
| `--min-width` | Minimum width of the alert |
| `--width` | Width of the alert |

## Renders sub-components

`ion-ripple-effect`, `ion-backdrop`
