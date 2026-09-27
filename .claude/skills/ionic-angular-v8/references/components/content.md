# ion-content

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonContent } from '@ionic/angular/standalone';
```

Add `IonContent` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `fixedSlotPlacement` | `fixed-slot-placement` | `"after" \| "before"` | `'after'` | Controls where the fixed content is placed relative to the main content in the DOM. This can be used to control the order in which fixed elements receive keyboard focus. For example, if a FAB in the fixed slot should receive keyboard focus before the main page content, set this property to `'before'`. |
| `forceOverscroll` | `force-overscroll` | `boolean \| undefined` |  | If `true` and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. If the content exceeds the bounds of ionContent, nothing will change. Note, this does not disable the system bounce on iOS. That is an OS level setting. |
| `fullscreen` | `fullscreen` | `boolean` | `false` | If `true`, the content will scroll behind the headers and footers. This effect can easily be seen by setting the toolbar to transparent. |
| `scrollEvents` | `scroll-events` | `boolean` | `false` | Because of performance reasons, ionScroll events are disabled by default, in order to enable them and start listening from (ionScroll), set this property to `true`. |
| `scrollX` | `scroll-x` | `boolean` | `false` | If you want to enable the content scrolling in the X axis, set this property to `true`. |
| `scrollY` | `scroll-y` | `boolean` | `true` | If you want to disable the content scrolling in the Y axis, set this property to `false`. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionScroll` | `ScrollDetail` | Emitted while scrolling. This event is disabled by default. Set `scrollEvents` to `true` to enable. |
| `ionScrollEnd` | `ScrollBaseDetail` | Emitted when the scroll has ended. This event is disabled by default. Set `scrollEvents` to `true` to enable. |
| `ionScrollStart` | `ScrollBaseDetail` | Emitted when the scroll has started. This event is disabled by default. Set `scrollEvents` to `true` to enable. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getScrollElement` | `getScrollElement() => Promise<HTMLElement>` | Get the element where the actual scrolling takes place. This element can be used to subscribe to `scroll` events or manually modify `scrollTop`. However, it's recommended to use the API provided by `ion-content`:  i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events and `scrollToPoint()` to scroll the content into a certain point. |
| `scrollByPoint` | `scrollByPoint(x: number, y: number, duration: number) => Promise<void>` | Scroll by a specified X/Y distance in the component. |
| `scrollToBottom` | `scrollToBottom(duration?: number) => Promise<void>` | Scroll to the bottom of the component. |
| `scrollToPoint` | `scrollToPoint(x: number \| undefined \| null, y: number \| undefined \| null, duration?: number) => Promise<void>` | Scroll to a specified X/Y location in the component. |
| `scrollToTop` | `scrollToTop(duration?: number) => Promise<void>` | Scroll to the top of the component. |

## Slots

| Slot | Description |
| --- | --- |
| `(default)` | Content is placed in the scrollable area if provided without a slot. |
| `fixed` | Should be used for fixed content that should not scroll. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `background` | The background of the content. |
| `scroll` | The scrollable container of the content. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the content |
| `--color` | Color of the content |
| `--keyboard-offset` | Keyboard offset of the content |
| `--offset-bottom` | Offset bottom of the content |
| `--offset-top` | Offset top of the content |
| `--padding-bottom` | Bottom padding of the content |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the content |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the content |
| `--padding-top` | Top padding of the content |
