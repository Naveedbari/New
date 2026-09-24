# Acceptance Criteria

## AC-01 Map accuracy
A selected real plot must visually align with the authority-approved map/GIS source within the agreed accuracy tolerance.

## AC-02 Search
Given a valid plot identifier, the app returns the correct plot.

## AC-03 Ambiguous search
If multiple results exist, the app clearly distinguishes them using sector/street/block information.

## AC-04 Plot selection
Selecting a result centers the map and highlights the correct polygon.

## AC-05 GPS
With location permission granted and adequate GPS signal, the current location is shown.

## AC-06 GPS permission denial
The app remains usable for map/search without GPS and explains how to enable location when navigation is requested.

## AC-07 Routing
A valid route is displayed between the current position and selected destination when routing data is available.

## AC-08 Route failure
If no route is available, the user receives a clear message and can return to the map.

## AC-09 Data update
An authorized admin can import and validate a new GIS dataset.

## AC-10 Failed import
Invalid GIS data cannot be published.

## AC-11 Rollback
A previously published dataset can be restored by an authorized user.

## AC-12 Security
A non-authorized user cannot access admin functions.

## AC-13 Performance
Map/search performance targets must be agreed after real dataset profiling; do not use arbitrary targets before profiling.

## AC-14 Privacy
The system does not retain unnecessary user location history.

## AC-15 Release
Production builds use production configuration and contain no development credentials or sample coordinates.
