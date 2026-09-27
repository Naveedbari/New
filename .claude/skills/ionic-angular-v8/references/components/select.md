# ion-select

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonSelect } from '@ionic/angular/standalone';
```

Add `IonSelect` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `cancelText` | `cancel-text` | `string` | `'Cancel'` | The text to display on the cancel button. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` |  | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).  This property is only available when using the modern select syntax. |
| `compareWith` | `compare-with` | `((currentValue: any, compareValue: any) => boolean) \| null \| string \| undefined` |  | This property allows developers to specify a custom function or property name for comparing objects when determining the selected option in the ion-select. When not specified, the default behavior will use strict equality (===) for comparison. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the select. |
| `errorText` | `error-text` | `string \| undefined` |  | Text that is placed under the select and displayed when an error is detected. |
| `expandedIcon` | `expanded-icon` | `string \| undefined` |  | The toggle icon to show when the select is open. If defined, the icon rotation behavior in `md` mode will be disabled. If undefined, `toggleIcon` will be used for when the select is both open and closed. |
| `fill` | `fill` | `"outline" \| "solid" \| undefined` |  | The fill for the item. If `"solid"` the item will have a background. If `"outline"` the item will be transparent with a border. Only available in `md` mode. |
| `helperText` | `helper-text` | `string \| undefined` |  | Text that is placed under the select and displayed when no error is detected. |
| `interface` | `interface` | `"action-sheet" \| "alert" \| "modal" \| "popover"` | `'alert'` | The interface the select should use: `action-sheet`, `popover`, `alert`, or `modal`. |
| `interfaceOptions` | `interface-options` | `any` | `{}` | Any additional options that the `alert`, `action-sheet` or `popover` interface can take. See the [ion-alert docs](./alert), the [ion-action-sheet docs](./action-sheet), the [ion-popover docs](./popover), and the [ion-modal docs](./modal) for the create options for each interface.  Note: `interfaceOptions` will not override `inputs` or `buttons` with the `alert` interface. |
| `justify` | `justify` | `"end" \| "space-between" \| "start" \| undefined` |  | How to pack the label and select within a line. `justify` does not apply when the label and select are on different lines when `labelPlacement` is set to `"floating"` or `"stacked"`. `"start"`: The label and select will appear on the left in LTR and on the right in RTL. `"end"`: The label and select will appear on the right in LTR and on the left in RTL. `"space-between"`: The label and select will appear on opposite ends of the line with space between the two elements. |
| `label` | `label` | `string \| undefined` |  | The visible label associated with the select.  Use this if you need to render a plaintext label.  The `label` property will take priority over the `label` slot if both are used. |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start" \| undefined` | `'start'` | Where to place the label relative to the select. `"start"`: The label will appear to the left of the select in LTR and to the right in RTL. `"end"`: The label will appear to the right of the select in LTR and to the left in RTL. `"floating"`: The label will appear smaller and above the select when the select is focused or it has a value. Otherwise it will appear on top of the select. `"stacked"`: The label will appear smaller and above the select regardless even when the select is blurred or has no value. `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("..."). When using `"floating"` or `"stacked"` we recommend initializing the select with either a `value` or a `placeholder`. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `multiple` | `multiple` | `boolean` | `false` | If `true`, the select can accept multiple values. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `okText` | `ok-text` | `string` | `'OK'` | The text to display on the ok button. |
| `placeholder` | `placeholder` | `string \| undefined` |  | The text to display when the select is empty. |
| `required` | `required` | `boolean` | `false` | If true, screen readers will announce it as a required field. This property works only for accessibility purposes, it will not prevent the form from submitting if the value is invalid. |
| `selectedText` | `selected-text` | `null \| string \| undefined` |  | The text to display instead of the selected option's value. |
| `shape` | `shape` | `"round" \| undefined` |  | The shape of the select. If "round" it will have an increased border radius. |
| `toggleIcon` | `toggle-icon` | `string \| undefined` |  | The toggle icon to use. Defaults to `chevronExpand` for `ios` mode, or `caretDownSharp` for `md` mode. |
| `value` | `value` | `any` |  | The value of the select. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the select loses focus. |
| `ionCancel` | `void` | Emitted when the selection is cancelled. |
| `ionChange` | `SelectChangeEventDetail<any>` | Emitted when the value has changed.  This event will not emit when programmatically setting the `value` property. |
| `ionDismiss` | `void` | Emitted when the overlay is dismissed. |
| `ionFocus` | `void` | Emitted when the select has focus. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `open` | `open(event?: UIEvent) => Promise<any>` | Open the select overlay. The overlay is either an alert, action sheet, or popover, depending on the `interface` property on the `ion-select`. |

## Slots

| Slot | Description |
| --- | --- |
| `end` | Content to display at the trailing edge of the select. |
| `label` | The label text to associate with the select. Use the `labelPlacement` property to control where the label is placed relative to the select. Use this if you need to render a label with custom HTML. |
| `start` | Content to display at the leading edge of the select. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `bottom` | The container element for helper text, error text, and counter. |
| `container` | The container for the selected text or placeholder. |
| `error-text` | Supporting text displayed beneath the select when the select is invalid and touched. |
| `helper-text` | Supporting text displayed beneath the select when the select is valid. |
| `icon` | The select icon container. |
| `inner` | The inner element of the wrapper that manages the slots, selected values or placeholder, and toggle icons. |
| `label` | The label text describing the select. |
| `placeholder` | The text displayed in the select when there is no value. |
| `supporting-text` | Supporting text displayed beneath the select. |
| `text` | The displayed value of the select. |
| `wrapper` | The clickable label element that wraps the entire form field (label text, slots, selected values or placeholder, and toggle icons). |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | Background of the select |
| `--border-color` | Color of the select border |
| `--border-radius` | Radius of the select border. A large radius may display unevenly when using fill="outline"; if needed, use shape="round" instead or increase --padding-start. |
| `--border-style` | Style of the select border |
| `--border-width` | Width of the select border |
| `--highlight-color-focused` | The color of the highlight on the select when focused |
| `--highlight-color-invalid` | The color of the highlight on the select when invalid |
| `--highlight-color-valid` | The color of the highlight on the select when valid |
| `--highlight-height` | The height of the highlight on the select. Only applies to md mode. |
| `--padding-bottom` | Bottom padding of the select |
| `--padding-end` | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the select |
| `--padding-start` | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the select |
| `--padding-top` | Top padding of the select |
| `--placeholder-color` | Color of the select placeholder text |
| `--placeholder-opacity` | Opacity of the select placeholder text |
| `--ripple-color` | The color of the ripple effect on MD mode. |

## Renders sub-components

`ion-select-popover`, `ion-popover`, `ion-action-sheet`, `ion-alert`, `ion-select-modal`, `ion-modal`, `ion-icon`
