# ion-nav

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonNav } from '@ionic/angular/standalone';
```

Add `IonNav` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `animated` | `animated` | `boolean` | `true` | If `true`, the nav should animate the transition of components. |
| `animation` |  | `((baseEl: any, opts?: any) => Animation) \| undefined` |  | By default `ion-nav` animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimationBuilder` functions. |
| `root` | `root` | `Function \| HTMLElement \| ViewController \| null \| string \| undefined` |  | Root NavComponent to load |
| `rootParams` |  | `T \| undefined` |  | Any parameters for the root component |
| `swipeGesture` | `swipe-gesture` | `boolean \| undefined` |  | If the nav component should allow for swipe-to-go-back. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionNavDidChange` | `void` | Event fired when the nav has changed components |
| `ionNavWillChange` | `void` | Event fired when the nav will change components |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `canGoBack` | `canGoBack(view?: ViewController) => Promise<boolean>` | Returns `true` if the current view can go back. |
| `getActive` | `getActive() => Promise<ViewController \| undefined>` | Get the active view. |
| `getByIndex` | `getByIndex(index: number) => Promise<ViewController \| undefined>` | Get the view at the specified index. |
| `getLength` | `getLength() => Promise<number>` | Returns the number of views in the stack. |
| `getPrevious` | `getPrevious(view?: ViewController) => Promise<ViewController \| undefined>` | Get the previous view. |
| `insert` | `insert<T extends NavComponent>(insertIndex: number, component: T, componentProps?: ComponentProps<T> \| null, opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Inserts a component into the navigation stack at the specified index. This is useful to add a component at any point in the navigation stack. |
| `insertPages` | `insertPages(insertIndex: number, insertComponents: NavComponent[] \| NavComponentWithProps[], opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Inserts an array of components into the navigation stack at the specified index. The last component in the array will become instantiated as a view, and animate in to become the active view. |
| `pop` | `pop(opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Pop a component off of the navigation stack. Navigates back from the current component. |
| `popTo` | `popTo(indexOrViewCtrl: number \| ViewController, opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Pop to a specific index in the navigation stack. |
| `popToRoot` | `popToRoot(opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Navigate back to the root of the stack, no matter how far back that is. |
| `push` | `push<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> \| null, opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Push a new component onto the current navigation stack. Pass any additional information along as an object. This additional information is accessible through NavParams. |
| `removeIndex` | `removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Removes a component from the navigation stack at the specified index. |
| `setPages` | `setPages(views: NavComponent[] \| NavComponentWithProps[], opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Set the views of the current navigation stack and navigate to the last view. By default animations are disabled, but they can be enabled by passing options to the navigation controller. Navigation parameters can also be passed to the individual pages in the array. |
| `setRoot` | `setRoot<T extends NavComponent>(component: T, componentProps?: ComponentProps<T> \| null, opts?: NavOptions \| null, done?: TransitionDoneFn) => Promise<boolean>` | Set the root for the current navigation stack to a component. |

## Slots

_None._

## CSS Shadow Parts

_None._

## CSS Custom Properties

_None._
