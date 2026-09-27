# ion-refresher-content

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)

```ts
import { IonRefresherContent } from '@ionic/angular/standalone';
```

Add `IonRefresherContent` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `pullingIcon` | `pulling-icon` | `null \| string \| undefined` |  | A static icon or a spinner to display when you begin to pull down. A spinner name can be provided to gradually show tick marks when pulling down on iOS devices. |
| `pullingText` | `pulling-text` | `IonicSafeString \| string \| undefined` |  | The text you want to display when you begin to pull down. `pullingText` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)  Content is parsed as plaintext by default. `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config before custom HTML can be used. |
| `refreshingSpinner` | `refreshing-spinner` | `"bubbles" \| "circles" \| "circular" \| "crescent" \| "dots" \| "lines" \| "lines-sharp" \| "lines-sharp-small" \| "lines-small" \| null \| undefined` |  | An animated SVG spinner that shows when refreshing begins |
| `refreshingText` | `refreshing-text` | `IonicSafeString \| string \| undefined` |  | The text you want to display when performing a refresh. `refreshingText` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)  Content is parsed as plaintext by default. `innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config before custom HTML can be used. |

## Events

_None._

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._

## Renders sub-components

`ion-spinner`, `ion-icon`
