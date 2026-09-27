# ion-route

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** none

## Import (standalone)


_Not a directly importable standalone component. Used as a sub-element of a parent component._

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `beforeEnter` |  | `(() => NavigationHookResult \| Promise<NavigationHookResult>) \| undefined` |  | A navigation hook that is fired when the route tries to enter. Returning `true` allows the navigation to proceed, while returning `false` causes it to be cancelled. Returning a `NavigationHookOptions` object causes the router to redirect to the path specified. |
| `beforeLeave` |  | `(() => NavigationHookResult \| Promise<NavigationHookResult>) \| undefined` |  | A navigation hook that is fired when the route tries to leave. Returning `true` allows the navigation to proceed, while returning `false` causes it to be cancelled. Returning a `NavigationHookOptions` object causes the router to redirect to the path specified. |
| `component` | `component` | `string` |  | Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`) when the route matches.  The value of this property is not always the tagname of the component to load, in `ion-tabs` it actually refers to the name of the `ion-tab` to select. |
| `componentProps` |  | `undefined \| { [key: string]: any; }` |  | A key value `{ 'red': true, 'blue': 'white'}` containing props that should be passed to the defined component when rendered. |
| `url` | `url` | `string` | `''` | Relative path that needs to match in order for this route to apply.  Accepts paths similar to expressjs so that you can define parameters in the url /foo/:bar where bar would be available in incoming props. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionRouteDataChanged` | `any` | Used internally by `ion-router` to know when this route did change. |

## Methods

_None._

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._

> **Angular note:** This element does not apply to Ionic Angular. Use the Angular Router with `IonRouterOutlet` instead — see `../guides/navigation.md`.
