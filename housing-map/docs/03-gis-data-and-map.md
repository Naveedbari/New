# GIS, Mapping and Data Specification

## 1. Most important discovery

Before development of the map engine, inspect the housing authority's source map.

Required questions:
1. What file format is the source?
2. Is it georeferenced?
3. What coordinate system/CRS does it use?
4. Are plot boundaries individual polygons?
5. Are roads represented as line features?
6. Are sectors/blocks polygons?
7. Are labels separate attributes or embedded in an image?
8. Are plot numbers machine-readable?
9. Are there duplicate plot numbers?
10. Does the source contain retired/cancelled plots?
11. What is the authoritative data source?
12. How frequently will the authority provide updates?

## 2. Preferred GIS model

### Plot
```text
id
plot_number
sector_id
block_id
street_id
road_id
plot_type
status
area
dimensions
authority_reference
center_point
geometry
source_dataset_version
created_at
updated_at
```

### Sector
```text
id
name
code
geometry
```

### Block
```text
id
sector_id
name
code
geometry
```

### Street/Lane
```text
id
block_id
name
code
geometry
```

### Road
```text
id
name
code
road_type
geometry
```

### Point of Interest
```text
id
name
category
geometry
status
```

## 3. Spatial requirements

Use PostGIS.

Recommended geometry:
- Plot: Polygon/MultiPolygon
- Sector/block: Polygon/MultiPolygon
- Road/street: LineString/MultiLineString
- POI: Point

Store geometry using the source/approved CRS and transform to the map display CRS as required.

Do not hard-code latitude/longitude values without documenting their CRS.

## 4. Georeferencing

If the authority provides a scanned map/image:

1. Obtain known control points.
2. Identify their real-world coordinates.
3. Georeference the image.
4. Validate alignment against known roads/coordinates.
5. Digitize required features.
6. Assign attributes.
7. Validate topology.
8. Publish a versioned GIS dataset.

## 5. Data quality checks

Validate:
- Duplicate IDs
- Duplicate plot numbers within a scope where uniqueness is expected
- Missing sector
- Missing street/lane
- Invalid geometries
- Self-intersecting polygons
- Overlapping plots
- Gaps where unexpected
- Wrong CRS
- Out-of-bound coordinates
- Missing road geometry
- Orphaned foreign keys
- Invalid status values

## 6. GIS import pipeline

```text
Source File
   ↓
Upload / Receive
   ↓
Parse
   ↓
CRS Detection
   ↓
Geometry Validation
   ↓
Attribute Mapping
   ↓
Business Validation
   ↓
Preview
   ↓
Approve
   ↓
Publish Dataset Version
   ↓
Mobile/API Consumption
```

Never publish an unvalidated import directly to production.

## 7. Search indexing

For large datasets:
- Index plot number
- Index sector/block/street IDs
- Add PostgreSQL full-text/trigram search if needed
- Add spatial indexes using GiST
- Avoid loading every plot into the mobile app at startup

## 8. Map performance

Use:
- Vector tiles or server-side tiled delivery for large datasets
- Viewport/bounding-box queries where appropriate
- Generalized geometries at lower zoom levels
- Detailed plot geometry only at suitable zoom levels
- Clustering for POIs if needed

Do not send the entire housing scheme as a huge JSON payload on every map load.

## 9. Routing

Routing is a separate GIS problem.

Required data:
- Routable road network
- Road connectivity
- Direction restrictions if relevant
- Road access restrictions if relevant
- Speed/profile data if ETA is required

Possible routing options:
- OSRM
- GraphHopper
- Valhalla
- A managed routing API

Select one after checking:
- Geographic coverage
- Licensing
- Cost
- Offline requirements
- Driving/walking support
- Re-routing
- Pakistan/local road coverage

## 10. Base map

The housing authority's GIS layer can be displayed over:
- OpenStreetMap-derived basemap
- Commercial basemap
- Authority-owned basemap

Licensing and attribution must be reviewed before production.
