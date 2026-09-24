# Mobile Application Specification

## 1. Recommended stack

- Ionic
- Angular
- Capacitor
- TypeScript
- RxJS
- Angular Router
- Secure local storage for tokens where applicable
- Native geolocation through Capacitor/plugin
- Map SDK selected during Milestone 1/2

## 2. Main screens

### 2.1 Splash
- App branding
- Initialization
- Configuration loading

### 2.2 Map/Home
Components:
- Map
- Search bar
- Current location button
- Layer button
- Zoom controls if needed
- Selected plot bottom sheet
- Navigation button

### 2.3 Search
- Search input
- Filters
- Recent searches
- Result list
- Result type indicator

### 2.4 Plot details
- Plot number
- Sector/block
- Street/lane
- Road
- Area/status if authorized
- View on map
- Navigate

### 2.5 Navigation
- Current location
- Destination
- Route line
- Distance
- ETA
- Recenter
- Stop navigation

### 2.6 Layers
Toggle:
- Plots
- Roads
- Sectors
- Streets
- Amenities
- Other approved layers

### 2.7 Settings
- Map preferences
- Units
- Language if required
- About
- Privacy
- Permissions
- Version

### 2.8 Login
Only if authentication is required.

## 3. Navigation UX

The app should:
- Keep the destination visible
- Keep current location visible
- Avoid excessive UI over the map
- Use a bottom sheet for plot details
- Clearly distinguish selected plot from surrounding plots
- Provide a clear route start/stop action

## 4. GPS behavior

Implement:
- Permission request
- Permission status
- Location acquisition
- Accuracy display where useful
- Location update subscription
- Cleanup of watchers
- Background tracking only if truly required
- Battery-conscious update frequency

## 5. Local storage

Use local storage for:
- App preferences
- Recent searches
- Favorites
- Cached configuration
- Non-sensitive cached plot data

Never store authentication secrets in plain local storage.

## 6. State management

Keep architecture simple for MVP:
- Feature-level services
- RxJS observables/signals as appropriate
- API repository/service layer
- Map state separated from business data
- Avoid unnecessary global state complexity

## 7. Mobile error states

Every major screen should define:
- Loading
- Empty
- Error
- Offline
- Permission denied
- Retry

## 8. Android requirements

- Location permissions
- Network permission
- Correct application ID
- Release signing
- Environment configuration
- Production API URL
- Crash reporting if approved

## 9. iOS preparation

Even if Android is MVP:
- Avoid Android-only business logic
- Keep platform-specific code behind services
- Use Capacitor abstractions where possible
