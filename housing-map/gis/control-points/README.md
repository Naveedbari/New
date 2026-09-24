# Ground control points (GCPs)

`dha-bahawalpur-brochure-gcps.csv` lists 8 junctions picked on the DHA Bahawalpur brochure map.
Their **pixel** positions are filled in. Their **real-world coordinates are blank** and must be
measured. Never estimate them.

## How to fill in a point

1. Find the point on the annotated brochure (shared outside Git, since the brochure is not committed).
2. Open Google Maps (satellite view) or Google Earth, find the same roundabout or junction, and
   right-click its centre. The first menu line shows `latitude, longitude`.
   Standing at the spot with a phone GPS also works, and is better.
3. Enter **longitude** and **latitude** in decimal degrees (for example `71.7`, `29.3`).
   Watch the order: the CSV has longitude first, while Google Maps shows latitude first.
4. Fill in `source` (for example `Google Maps satellite` or `phone GPS 2026-09-25`).

Skip any point you can't identify with confidence. At least 3 are needed for the affine
model and 6 for `poly2`; all 8 give the best error estimate.

## Run

```bash
node gis/scripts/georeference.mjs --gcp gis/control-points/dha-bahawalpur-brochure-gcps.csv \
  --model affine --width 1536 --height 1075 --out gis/processed/dha-bahawalpur-brochure
```

The script prints each point's error in metres. The leave-one-out column is the realistic
accuracy for places between the points. A single point with a much larger error than the rest
usually has swapped or mistyped coordinates.

## What this can and cannot give

This brochure is a marketing drawing, so even with good GCPs expect **tens of metres** of error.
That is enough to place sectors, main roads and amenities on the map roughly. It is **not** enough
for plot boundaries, and the plot numbers can't be read at this resolution anyway.
Real plot data still needs the official layout plan (see `docs/GIS-Feasibility-Report.md` §6).
