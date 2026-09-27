# ion-datetime

> Angular v8 standalone API reference. Generated from @ionic/core 4.43.0 docs.json.

- **Encapsulation:** shadow

## Import (standalone)

```ts
import { IonDatetime } from '@ionic/angular/standalone';
```

Add `IonDatetime` to the component's `imports: []` array.

## Properties

| Prop | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `cancelText` | `cancel-text` | `string` | `'Cancel'` | The text to display on the picker's cancel button. |
| `clearText` | `clear-text` | `string` | `'Clear'` | The text to display on the picker's "Clear" button. |
| `color` | `color` | `"danger" \| "dark" \| "light" \| "medium" \| "primary" \| "secondary" \| "success" \| "tertiary" \| "warning" \| string & Record<never, never> \| undefined` | `'primary'` | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). |
| `dayValues` | `day-values` | `number \| number[] \| string \| undefined` |  | Values used to create the list of selectable days. By default every day is shown for the given month. However, to control exactly which days of the month to display, the `dayValues` input can take a number, an array of numbers, or a string of comma separated numbers. Note that even if the array days have an invalid number for the selected month, like `31` in February, it will correctly not show days which are not valid for the selected month. |
| `disabled` | `disabled` | `boolean` | `false` | If `true`, the user cannot interact with the datetime. |
| `doneText` | `done-text` | `string` | `'Done'` | The text to display on the picker's "Done" button. |
| `firstDayOfWeek` | `first-day-of-week` | `number` | `0` | The first day of the week to use for `ion-datetime`. The default value is `0` and represents Sunday. |
| `formatOptions` |  | `undefined \| { date: DateTimeFormatOptions; time?: DateTimeFormatOptions \| undefined; } \| { date?: DateTimeFormatOptions \| undefined; time: DateTimeFormatOptions; }` |  | Formatting options for dates and times. Should include a 'date' and/or 'time' object, each of which is of type [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options). |
| `highlightedDates` |  | `((dateIsoString: string) => DatetimeHighlightStyle \| undefined) \| DatetimeHighlight[] \| undefined` |  | Used to apply custom text and background colors to specific dates.  Can be either an array of objects containing ISO strings and colors, or a callback that receives an ISO string and returns the colors.  Only applies to the `date`, `date-time`, and `time-date` presentations, with `preferWheel="false"`. |
| `hourCycle` | `hour-cycle` | `"h11" \| "h12" \| "h23" \| "h24" \| undefined` |  | The hour cycle of the `ion-datetime`. If no value is set, this is specified by the current locale. |
| `hourValues` | `hour-values` | `number \| number[] \| string \| undefined` |  | Values used to create the list of selectable hours. By default the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However, to control exactly which hours to display, the `hourValues` input can take a number, an array of numbers, or a string of comma separated numbers. |
| `isDateEnabled` |  | `((dateIsoString: string) => boolean) \| undefined` |  | Returns if an individual date (calendar day) is enabled or disabled.  If `true`, the day will be enabled/interactive. If `false`, the day will be disabled/non-interactive.  The function accepts an ISO 8601 date string of a given day. By default, all days are enabled. Developers can use this function to write custom logic to disable certain days.  The function is called for each rendered calendar day, for the previous, current and next month. Custom implementations should be optimized for performance to avoid jank. |
| `locale` | `locale` | `string` | `'default'` | The locale to use for `ion-datetime`. This impacts month and day name formatting. The `"default"` value refers to the default locale set by your device. |
| `max` | `max` | `string \| undefined` |  | The maximum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the maximum could just be the year, such as `1994`. Defaults to the end of this year. |
| `min` | `min` | `string \| undefined` |  | The minimum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), such as `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the minimum could just be the year, such as `1994`. Defaults to the beginning of the year, 100 years ago from today. |
| `minuteValues` | `minute-values` | `number \| number[] \| string \| undefined` |  | Values used to create the list of selectable minutes. By default the minutes range from `0` to `59`. However, to control exactly which minutes to display, the `minuteValues` input can take a number, an array of numbers, or a string of comma separated numbers. For example, if the minute selections should only be every 15 minutes, then this input value would be `minuteValues="0,15,30,45"`. |
| `mode` | `mode` | `"ios" \| "md"` |  | The mode determines which platform styles to use. |
| `monthValues` | `month-values` | `number \| number[] \| string \| undefined` |  | Values used to create the list of selectable months. By default the month values range from `1` to `12`. However, to control exactly which months to display, the `monthValues` input can take a number, an array of numbers, or a string of comma separated numbers. For example, if only summer months should be shown, then this input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a zero-based index, meaning January's value is `1`, and December's is `12`. |
| `multiple` | `multiple` | `boolean` | `false` | If `true`, multiple dates can be selected at once. Only applies to `presentation="date"` and `preferWheel="false"`. |
| `name` | `name` | `string` | `this.inputId` | The name of the control, which is submitted with the form data. |
| `preferWheel` | `prefer-wheel` | `boolean` | `false` | If `true`, a wheel picker will be rendered instead of a calendar grid where possible. If `false`, a calendar grid will be rendered instead of a wheel picker where possible.  A wheel picker can be rendered instead of a grid when `presentation` is one of the following values: `"date"`, `"date-time"`, or `"time-date"`.  A wheel picker will always be rendered regardless of the `preferWheel` value when `presentation` is one of the following values: `"time"`, `"month"`, `"month-year"`, or `"year"`. |
| `presentation` | `presentation` | `"date" \| "date-time" \| "month" \| "month-year" \| "time" \| "time-date" \| "year"` | `'date-time'` | Which values you want to select. `"date"` will show a calendar picker to select the month, day, and year. `"time"` will show a time picker to select the hour, minute, and (optionally) AM/PM. `"date-time"` will show the date picker first and time picker second. `"time-date"` will show the time picker first and date picker second. |
| `readonly` | `readonly` | `boolean` | `false` | If `true`, the datetime appears normal but the selected date cannot be changed. |
| `showAdjacentDays` | `show-adjacent-days` | `boolean` | `false` | If `true`, the datetime calendar displays a six-week (42-day) layout, including days from the previous and next months to fill the grid. These adjacent days are selectable unless disabled. |
| `showClearButton` | `show-clear-button` | `boolean` | `false` | If `true`, a "Clear" button will be rendered alongside the default "Cancel" and "OK" buttons at the bottom of the `ion-datetime` component. Developers can also use the `button` slot if they want to customize these buttons. If custom buttons are set in the `button` slot then the default buttons will not be rendered. |
| `showDefaultButtons` | `show-default-buttons` | `boolean` | `false` | If `true`, the default "Cancel" and "OK" buttons will be rendered at the bottom of the `ion-datetime` component. Developers can also use the `button` slot if they want to customize these buttons. If custom buttons are set in the `button` slot then the default buttons will not be rendered. |
| `showDefaultTimeLabel` | `show-default-time-label` | `boolean` | `true` | If `true`, the default "Time" label will be rendered for the time selector of the `ion-datetime` component. Developers can also use the `time-label` slot if they want to customize this label. If a custom label is set in the `time-label` slot then the default label will not be rendered. |
| `showDefaultTitle` | `show-default-title` | `boolean` | `false` | If `true`, a header will be shown above the calendar picker. This will include both the slotted title, and the selected date. |
| `size` | `size` | `"cover" \| "fixed"` | `'fixed'` | If `cover`, the `ion-datetime` will expand to cover the full width of its container. If `fixed`, the `ion-datetime` will have a fixed width. |
| `titleSelectedDatesFormatter` |  | `((selectedDates: string[]) => string) \| undefined` |  | A callback used to format the header text that shows how many dates are selected. Only used if there are 0 or more than 1 selected (i.e. unused for exactly 1). By default, the header text is set to "numberOfDates days".  See https://ionicframework.com/docs/troubleshooting/runtime#accessing-this if you need to access `this` from within the callback. |
| `value` | `value` | `null \| string \| string[] \| undefined` |  | The value of the datetime as a valid ISO 8601 datetime string. This should be an array of strings only when `multiple="true"`. |
| `yearValues` | `year-values` | `number \| number[] \| string \| undefined` |  | Values used to create the list of selectable years. By default the year values range between the `min` and `max` datetime inputs. However, to control exactly which years to display, the `yearValues` input can take a number, an array of numbers, or string of comma separated numbers. For example, to show upcoming and recent leap years, then this input's value would be `yearValues="2008,2012,2016,2020,2024"`. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `ionBlur` | `void` | Emitted when the datetime loses focus. |
| `ionCancel` | `void` | Emitted when the datetime selection was cancelled. |
| `ionChange` | `DatetimeChangeEventDetail` | Emitted when the value (selected date) has changed.  This event will not emit when programmatically setting the `value` property. |
| `ionFocus` | `void` | Emitted when the datetime has focus. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `cancel` | `cancel(closeOverlay?: boolean) => Promise<void>` | Emits the ionCancel event and optionally closes the popover or modal that the datetime was presented in. |
| `confirm` | `confirm(closeOverlay?: boolean) => Promise<void>` | Confirms the selected datetime value, updates the `value` property, and optionally closes the popover or modal that the datetime was presented in. |
| `reset` | `reset(startDate?: string) => Promise<void>` | Resets the internal state of the datetime but does not update the value. Passing a valid ISO-8601 string will reset the state of the component to the provided date. If no value is provided, the internal state will be reset to the clamped value of the min, max and today. |

## Slots

| Slot | Description |
| --- | --- |
| `buttons` | The buttons in the datetime. |
| `time-label` | The label for the time selector in the datetime. |
| `title` | The title of the datetime. |

## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `calendar-day` | The individual buttons that display a day inside of the datetime calendar. |
| `calendar-day active` | The currently selected calendar day. |
| `calendar-day disabled` | The calendar day that is disabled. |
| `calendar-day today` | The calendar day that contains the current day. |
| `calendar-days-of-week` | The container for the day-of-the-week header (both weekdays and weekends) when using a grid style layout. |
| `calendar-header` | The calendar header manages the date navigation controls (month/year picker and previous/next buttons) and the days of the week when using a grid style layout. |
| `datetime-header` | The datetime header contains the content for the `title` slot and the selected date. |
| `datetime-selected-date` | The element that contains the selected date. |
| `datetime-title` | The element that contains the `title` slot content. |
| `month-year-button` | The button that opens the month/year picker when using a grid style layout. |
| `navigation-button` | The buttons used to navigate to the next or previous month when using a grid style layout. |
| `next-button` | The button used to navigate to the next month when using a grid style layout. |
| `previous-button` | The button used to navigate to the previous month when using a grid style layout. |
| `time-button` | The button that opens the time picker when using a grid style layout with `presentation="date-time"` or `"time-date"`. |
| `time-button active` | The time picker button when the picker is open. |
| `wheel` | The wheel container when using a wheel style layout, or in the month/year picker when using a grid style layout. |
| `wheel-item` | The individual items when using a wheel style layout, or in the month/year picker when using a grid style layout. |
| `wheel-item active` | The currently selected wheel-item. |

## CSS Custom Properties

| Variable | Description |
| --- | --- |
| `--background` | The primary background of the datetime component. |
| `--background-rgb` | The primary background of the datetime component in RGB format. |
| `--title-color` | The text color of the title. |
| `--wheel-fade-background-rgb` | The color of the gradient covering non-selected items when using a wheel style layout, or in the month/year picker for grid style layouts. Must be in RGB format, e.g. `255, 255, 255`. |
| `--wheel-highlight-background` | The background of the highlight under the selected item when using a wheel style layout, or in the month/year picker for grid style layouts. |
| `--wheel-highlight-border-radius` | The border radius of the highlight under the selected item when using a wheel style layout, or in the month/year picker for grid style layouts. |

## Renders sub-components

`ion-buttons`, `ion-button`, `ion-picker`, `ion-picker-column`, `ion-picker-column-option`, `ion-icon`, `ion-ripple-effect`, `ion-popover`
