# ion-segment

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonSegment } from '@ionic/angular/standalone';
```

Add `IonSegment` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the segment. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `scrollable` | `scrollable` | `boolean` | `false` | If `true`, the segment buttons will overflow and the user can swipe to see them. In addition, this will disable the gesture to drag the indicator between the buttons in order to swipe to see hidden buttons. |
| `selectOnFocus` | `select-on-focus` | `boolean` | `false` | If `true`, navigating to an `ion-segment-button` with the keyboard will focus and select the element. If `false`, keyboard navigation will only focus the `ion-segment-button` element. |
| `swipeGesture` | `swipe-gesture` | `boolean` | `true` | If `true`, users will be able to swipe between segment buttons to activate them. |
| `value` | `value` | `number \| string \| undefined` |  | the value of the segment. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionChange` | `SegmentChangeEventDetail` | Emitted when the value property has changed and any dragging pointer has been released from `ion-segment`.  This event will not emit when programmatically setting the `value` property. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the segment button |
