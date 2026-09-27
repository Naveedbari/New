# ion-action-sheet

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** scoped

## Import (standalone)

```ts
import { IonActionSheet, ActionSheetController } from '@ionic/angular/standalone';
```

Add `IonActionSheet` to the component's `imports: []` array.

Inject `ActionSheetController` via constructor DI to present `ion-action-sheet` programmatically.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the action sheet will animate. |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | If `true`, the action sheet will be dismissed when the backdrop is clicked. |
| `buttons` |  | `(string \| ActionSheetButton<any>)[]` | `[]` | An array of buttons for the action sheet. |
| `cssClass` | `css-class` | `string \| string[] \| undefined` |  | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. |
| `enterAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the action sheet is presented. |
| `header` | `header` | `string \| undefined` |  | Title for the action sheet. |
| `htmlAttributes` |  | `undefined \| { [key: string]: any; }` |  | Additional attributes to pass to the action sheet. |
| `isOpen` | `is-open` | `boolean` | `false` | If `true`, the action sheet will open. If `false`, the action sheet will close. Use this if you need finer grained control over presentation, otherwise just use the actionSheetController or the `trigger` property. Note: `isOpen` will not automatically be set back to `false` when the action sheet dismisses. You will need to do that in your code. |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | If `true`, the keyboard will be automatically dismissed when the overlay is presented. |
| `leaveAnimation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | Animation to use when the action sheet is dismissed. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `subHeader` | `sub-header` | `string \| undefined` |  | Subtitle for the action sheet. |
| `translucent` | `translucent` | `boolean` | `false` | If `true`, the action sheet will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility). |
| `trigger` | `trigger` | `string \| undefined` |  | An ID corresponding to the trigger element that causes the action sheet to open when clicked. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `didDismiss` | `OverlayEventDetail<any>` | Emitted after the action sheet has dismissed. Shorthand for ionActionSheetDidDismiss. |
| `didPresent` | `void` | Emitted after the action sheet has presented. Shorthand for ionActionSheetWillDismiss. |
| `ionActionSheetDidDismiss` | `OverlayEventDetail<any>` | Emitted after the action sheet has dismissed. |
| `ionActionSheetDidPresent` | `void` | Emitted after the action sheet has presented. |
| `ionActionSheetWillDismiss` | `OverlayEventDetail<any>` | Emitted before the action sheet has dismissed. |
| `ionActionSheetWillPresent` | `void` | Emitted before the action sheet has presented. |
| `willDismiss` | `OverlayEventDetail<any>` | Emitted before the action sheet has dismissed. Shorthand for ionActionSheetWillDismiss. |
| `willPresent` | `void` | Emitted before the action sheet has presented. Shorthand for ionActionSheetWillPresent. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `dismiss` | `dismiss(data?: any, role?: string) => Promise<boolean>` | Dismiss the action sheet overlay after it has been presented. This is a no-op if the overlay has not been presented yet. If you want to remove an overlay from the DOM that was never presented, use the [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method. |
| `onDidDismiss` | `onDidDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the action sheet did dismiss. |
| `onWillDismiss` | `onWillDismiss<T = any>() => Promise<OverlayEventDetail<T>>` | Returns a promise that resolves when the action sheet will dismiss. |
| `present` | `present() => Promise<void>` | Present the action sheet overlay after it has been created. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--backdrop-opacity` | Opacity of the backdrop |
| `--background` | Background of the action sheet group |
| `--button-background` | Background of the action sheet button |
| `--button-background-activated` | Background of the action sheet button when pressed. Note: setting this will interfere with the Material Design ripple. |
| `--button-background-activated-opacity` | Opacity of the action sheet button background when pressed |
| `--button-background-focused` | Background of the action sheet button when tabbed to |
| `--button-background-focused-opacity` | Opacity of the action sheet button background when tabbed to |
| `--button-background-hover` | Background of the action sheet button on hover |
| `--button-background-hover-opacity` | Opacity of the action sheet button background on hover |
| `--button-background-selected` | Background of the selected action sheet button |
| `--button-background-selected-opacity` | Opacity of the selected action sheet button background |
| `--button-color` | Color of the action sheet button |
| `--button-color-activated` | Color of the action sheet button when pressed |
| `--button-color-disabled` | Color of the selected action sheet button when disabled |
| `--button-color-focused` | Color of the action sheet button when tabbed to |
| `--button-color-hover` | Color of the action sheet button on hover |
| `--button-color-selected` | Color of the selected action sheet button |
| `--color` | Color of the action sheet text |
| `--height` | height of the action sheet |
| `--max-height` | Maximum height of the action sheet |
| `--max-width` | Maximum width of the action sheet |
| `--min-height` | Minimum height of the action sheet |
| `--min-width` | Minimum width of the action sheet |
| `--width` | Width of the action sheet |

## Renders sub-components

`ion-icon`, `ion-ripple-effect`, `ion-backdrop`
