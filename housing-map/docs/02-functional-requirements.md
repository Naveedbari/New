# Functional Requirements

## FR-001 App launch
The app shall load a map or a controlled fallback screen.

## FR-002 Map interaction
The user shall pan and zoom the map.

## FR-003 Plot search
The user shall search by plot number.

## FR-004 Advanced plot search
The user shall filter by sector/block + street/lane + plot number.

## FR-005 Road search
The user shall search for configured roads.

## FR-006 Sector search
The user shall search for configured sectors/blocks.

## FR-007 Search result
Each result shall display enough information to distinguish it from other results.

## FR-008 Plot focus
Selecting a plot shall center and zoom the map to that plot.

## FR-009 Plot highlight
The selected plot shall have a visible selected state.

## FR-010 Plot details
The user shall open a details panel for the selected plot.

## FR-011 Current location
The user shall be able to display their current GPS location.

## FR-012 Location permission
The app shall handle permission states gracefully.

## FR-013 Route start
The user shall start navigation to a selected plot.

## FR-014 Route display
The route shall be drawn on the map.

## FR-015 Route metrics
The app shall display distance and ETA when supported.

## FR-016 Rerouting
The navigation system shall recalculate the route after meaningful deviation when supported.

## FR-017 Arrival
The app shall detect/report arrival using configurable thresholds.

## FR-018 Layer controls
The user shall be able to show/hide supported layers.

## FR-019 Map legend
The app shall provide a legend explaining symbols/colors.

## FR-020 Recent searches
The app may retain recent searches locally.

## FR-021 Favorites
The app may allow saving plots as favorites.

## FR-022 Admin data import
Authorized administrators shall be able to import approved GIS data.

## FR-023 Import validation
The system shall validate imported GIS data before publication.

## FR-024 Data versioning
Each published GIS dataset shall have a version.

## FR-025 Rollback
Authorized administrators shall be able to roll back to a previous valid dataset.

## FR-026 Audit
Administrative data changes shall be auditable.

## FR-027 API security
Protected APIs shall require authentication.

## FR-028 Authorization
Administrative APIs shall enforce role/permission checks.

## FR-029 Monitoring
Production errors shall be observable through approved monitoring.

## FR-030 Privacy
Location data shall only be collected/retained when necessary and approved.
