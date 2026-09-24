# Housing Authority Map & Plot Navigation App
## Product Specification Package — v0.1

## 1. Purpose

Build a mobile-first map application for a housing authority that allows authorized users to:

- Search for plots by plot number, sector/block, street/lane, road, and other configured identifiers.
- View the exact plot on the housing-scheme map.
- View plot boundaries and related map information.
- See the user's current GPS location.
- Navigate from the user's current location to a selected plot.
- Search and inspect roads, sectors, streets/lanes, parks, amenities, and other configured map features.
- Work reliably on Android initially, with architecture suitable for iOS later if required.

The app is **not a generic Google Maps replacement**. The housing authority's own GIS/map dataset is the authoritative source for plots and scheme features.

## 2. Recommended product architecture

```text
Mobile App
   |
   | HTTPS
   v
Backend API
   |
   +---- PostgreSQL + PostGIS
   |
   +---- Authentication / Authorization
   |
   +---- Plot / Road / Sector / GIS APIs
   |
   +---- Search APIs
   |
   +---- Audit / Admin APIs
   |
   v
GIS / Routing Layer

External/optional services:
- Base map provider
- Routing engine/provider
- Geocoding provider
- Push notification service
- Crash/error monitoring
```

## 3. Recommended technology direction

### Mobile
- Ionic + Angular
- Capacitor
- TypeScript
- Android first
- Offline-ready architecture where practical

### Backend
- ASP.NET Core Web API
- Clean Architecture
- Entity Framework Core
- PostgreSQL
- PostGIS for spatial data

### Map
Prefer a GIS-capable map renderer such as MapLibre GL/MapLibre Native or another provider selected during technical discovery.

### Spatial data
- GeoJSON for exchange/API where appropriate
- PostGIS geometry/geography types for storage and spatial queries
- Coordinate reference systems documented explicitly
- Never assume the source map is already GPS/georeferenced

## 4. Critical project assumption

The housing authority map may be:
- PDF
- image/scanned map
- CAD/DWG/DXF
- KML/KMZ
- Shapefile
- GeoJSON
- another GIS format

The first technical milestone must determine whether the supplied map is already georeferenced.

A visually accurate map image alone is not sufficient for reliable GPS navigation. It must be georeferenced or converted into spatial features with real-world coordinates.

## 5. Primary user journey

```text
Open App
  -> Map
  -> Search
  -> Select Plot
  -> Plot Details
  -> Show on Map
  -> Navigate
  -> GPS tracking
  -> Route to destination
  -> Arrive / End navigation
```

## 6. Non-goals for MVP

Do not implement these unless specifically approved:
- Property buying/selling marketplace
- Payment processing
- Public property ownership transfer
- Complex land-record legal workflows
- Turn-by-turn voice navigation comparable to Google Maps
- 3D buildings
- Satellite imagery
- Social features
- Chat
- Advertising

These can become later phases.
