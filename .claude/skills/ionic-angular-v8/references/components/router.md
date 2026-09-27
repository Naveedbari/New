# ion-router

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)


_Not a directly importable standalone component. Used as a sub-element of a parent component._

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `root` | `root` | `string` | `'/'` | The root path to use when matching URLs. By default, this is set to "/", but you can specify an alternate prefix for all URL paths. |
| `useHash` | `use-hash` | `boolean` | `true` | The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it's deployed.  Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the other side hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionRouteDidChange` | `RouterEventDetail` | Emitted when the route had changed |
| `ionRouteWillChange` | `RouterEventDetail` | Event emitted when the route is about to change |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `back` | `back() => Promise<void>` | Go back to previous page in the window.history. |
| `push` | `push(path: string, direction?: RouterDirection, animation?: AnimationBuilder) => Promise<boolean>` | Navigate to the specified path. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._

> **Angular note:** This element does not apply to Ionic Angular. Use the Angular Router with `IonRouterOutlet` instead — see `../guides/navigation.md`.
