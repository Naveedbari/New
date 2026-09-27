# ion-img

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonImg } from '@ionic/angular/standalone';
```

Add `IonImg` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `alt` | `alt` | `string \| undefined` |  | This attribute defines the alternative text describing the image. Users will see this text displayed if the image URL is wrong, the image is not in one of the supported formats, or if the image is not yet downloaded. |
| `src` | `src` | `string \| undefined` |  | The image URL. This attribute is mandatory for the `<img>` element. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionError` | `void` | Emitted when the img fails to load |
| `ionImgDidLoad` | `void` | Emitted when the image has finished loading |
| `ionImgWillLoad` | `void` | Emitted when the img src has been set |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `image` | The inner `img` element. |

## CSS Custom Properties

_None._
