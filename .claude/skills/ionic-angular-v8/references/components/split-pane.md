# ion-split-pane

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonSplitPane } from '@ionic/angular/standalone';
```

Add `IonSplitPane` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `contentId` | `content-id` | `string \| undefined` |  | The `id` of the main content. When using a router this is typically `ion-router-outlet`. When not using a router, this is typically your main view's `ion-content`. This is not the id of the `ion-content` inside of your `ion-menu`. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the split pane will be hidden. |
| `when` | `when` | `boolean \| string` | `QUERY['lg']` | When the split-pane should be shown. Can be a CSS media query expression, or a shortcut expression. Can also be a boolean expression. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionSplitPaneVisible` | `{ visible: boolean; }` | Expression to be called when the split-pane visibility has changed |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--border` | Border between panes |
| `--side-max-width` | Maximum width of the side pane. Does not apply when split pane is collapsed. |
| `--side-min-width` | Minimum width of the side pane. Does not apply when split pane is collapsed. |
| `--side-width` | Width of the side pane. Does not apply when split pane is collapsed. |
