# Product Requirements Document

## 1. Users

### 1.1 Public/standard user
Can:
- Open map
- Search plots
- View plot details
- Use current location
- Navigate to a plot
- Search roads/sectors/streets if enabled

### 1.2 Authority/admin user
Can additionally:
- Manage map metadata
- Import/update GIS data
- Manage searchable attributes
- Enable/disable features
- Review import errors
- Manage users/roles
- View audit logs

### 1.3 Super admin
Can:
- Manage administrators
- Configure system-wide settings
- Manage permissions
- Manage integrations
- Access system/audit configuration

## 2. Authentication

MVP options:
- Guest access for public map/search, OR
- Phone/email + password login

If the authority requires restricted access:
- Access token authentication
- Refresh token
- Role-based authorization
- Secure logout
- Password reset
- Session/device management

The final decision should be made before Milestone 2.

## 3. Map requirements

### 3.1 Map display
The map must support:
- Pan
- Zoom in/out
- Fit to selected feature
- Rotation if supported
- Current-location marker
- Plot polygons
- Roads
- Sectors/blocks
- Streets/lanes
- Points of interest
- Optional labels

### 3.2 Plot visualization
Each plot can have:
- Unique internal ID
- Plot number
- Sector/block
- Street/lane
- Road
- Plot type
- Status
- Area
- Geometry/boundary
- Center point
- Optional authority reference number

Plot states may include:
- Available
- Allocated
- Sold
- Reserved
- Blocked
- Under dispute
- Unknown

Only statuses approved by the authority should be used.

### 3.3 Map layers
Layer visibility should be configurable.

Example:
- Plots
- Roads
- Street/lane
- Sector/block boundaries
- Parks
- Commercial
- Mosque
- School
- Hospital
- Office
- Other amenities

## 4. Search

Search must support:
- Plot number
- Sector
- Block
- Street/lane
- Road
- Combined filters
- Partial text
- Exact match
- Recent searches

Example:

```text
Sector: B
Street: 4
Plot: 125
```

Search result should show:
- Plot number
- Sector
- Street
- Road
- Optional area/status
- Map preview or distance

Selecting a result:
1. Opens plot details.
2. Centers map on plot.
3. Highlights plot boundary.

## 5. Current location

The app must:
- Request location permission clearly.
- Display current position.
- Handle permission denied.
- Handle GPS unavailable.
- Show location accuracy where appropriate.
- Allow recentering.
- Continue location updates during navigation according to approved battery policy.

The app must never silently assume a location.

## 6. Navigation

User flow:

```text
Select Plot
-> Navigate
-> Request/confirm location permission
-> Get current location
-> Calculate route
-> Draw route
-> Show distance
-> Show ETA where supported
-> Track movement
-> Recalculate if user deviates
-> Detect arrival
```

Navigation modes:
- Driving
- Walking
- Optional cycling

Only enable modes supported by the selected routing engine.

### Important
The route must use a routable road network. Plot polygons alone cannot generate a reliable driving route.

## 7. Plot details

Suggested details:
- Plot number
- Sector/block
- Street/lane
- Road
- Plot type
- Area
- Dimensions if available
- Status
- Authority reference
- Coordinates
- Last GIS update
- Optional notes

Sensitive ownership information should not be exposed in the public/mobile API unless explicitly authorized.

## 8. Nearby search

Optional MVP+ feature:
- Nearby roads
- Nearby plots
- Nearby parks
- Nearby amenities
- Nearby authority offices

Search radius should be configurable.

## 9. Favorites/recent searches

Optional:
- Favorite plots
- Recent plots
- Recent searches
- Home/office location

These can initially be stored locally on the device.

## 10. Offline support

Recommended staged approach.

### MVP
- Cache basic map metadata
- Cache recent plot searches
- Cache selected plot details

### Later
- Download an entire housing-scheme map package
- Offline plot search
- Offline map rendering
- Offline route if routing engine supports it

Offline GPS can identify the device position, but offline routing requires a local routing dataset/engine.

## 11. Notifications

Optional:
- Data update notification
- System announcement
- Maintenance notification

Do not add push notifications unless a real business requirement exists.

## 12. Error handling

User-friendly errors are required for:
- No internet
- GPS unavailable
- Location permission denied
- Plot not found
- Route unavailable
- Map data unavailable
- Server unavailable
- Invalid/obsolete GIS data
- Authentication failure

Never expose raw stack traces to users.

## 13. Accessibility

Support:
- Large touch targets
- Readable text
- Good contrast
- Screen-reader-friendly controls where practical
- Clear error messages
- Non-color-only status indicators

## 14. Analytics

If approved:
- Search performed
- Plot opened
- Navigation started
- Navigation completed
- Route failed
- Map errors
- App crashes

Do not collect unnecessary personal/location history.
