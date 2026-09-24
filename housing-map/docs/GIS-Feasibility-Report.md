# GIS Feasibility Report — DHA Bahawalpur (Milestone 0)

Status: **Draft v0.1 — Milestone 0 NOT yet passed**
Date: 2026-09-24
Scope: Assess whether the supplied map can become the authoritative, georeferenced
GIS dataset required by `03-gis-data-and-map.md` and `07-milestones.md`.

---

## 1. Summary

The supplied source is a **low-resolution marketing brochure image**, not a GIS
dataset. It is useful as a visual reference for understanding the scheme's layout
(sectors, main roads, commercial areas, parks), but it **cannot** be used on its own
to produce:

- correct GPS coordinates for plots,
- machine-readable plot numbers, or
- a routable road network.

**Recommendation:** Do not start Milestone 1 data work from this image. Request the
official layout plan from DHA Bahawalpur (CAD/GIS preferred; see §6). If only paper or
PDF plans are available, use the georeference-and-digitize path described in §5.

---

## 2. Source inspected

| Property | Finding |
|---|---|
| File | `image.jpg` (supplied in chat; **not committed**, see §8) |
| Format | JPEG, baseline, JFIF 1.01 |
| Resolution | 1536 × 1075 px, 3-channel RGB |
| Embedded metadata | None. No EXIF, no GeoTIFF tags, no world file (`.jgw`) |
| Publisher | "Bahawalpur Defence Property Associate" (Reg No: 120), a private real-estate agency. Printed by a third-party print house |
| Authority | DHA Bahawalpur branding is used, but this is **not** an authority-issued document |
| Date / version | None shown |

---

## 3. Answers to the discovery questions (`03-gis-data-and-map.md` §1)

| # | Question | Answer from this source |
|---|---|---|
| 1 | File format | Raster image (JPEG) |
| 2 | Georeferenced? | **No.** No coordinates, graticule, grid, or control points |
| 3 | CRS | **None.** Pixel space only. A north arrow is shown on the right edge, but no scale bar |
| 4 | Plot boundaries as individual polygons? | **No.** Plots are drawn as colored cells in a raster. At this resolution many are 3–6 px wide, so edges cannot be traced reliably |
| 5 | Roads as line features? | **No.** Roads are drawn as white/grey bands. The main boulevards, ring roads and the canal-side road are visually traceable. Internal streets are only partly visible |
| 6 | Sectors/blocks as polygons? | **No.** Sector letters are printed in the image (e.g. A, C, D, E, H, N, plus "Sector-Zee (Hootwala)" north of the canal). Boundaries are implied by color and roads, not drawn explicitly |
| 7 | Labels as attributes or embedded? | **Embedded in the image** |
| 8 | Plot numbers machine-readable? | **No.** Plot numbers cannot be read at this resolution. OCR is not viable |
| 9 | Duplicate plot numbers? | Unknown. Needs the authority dataset |
| 10 | Retired/cancelled plots? | Unknown |
| 11 | Authoritative source? | **Not this image.** The authority is DHA Bahawalpur |
| 12 | Update frequency | Unknown. Ask the authority |

---

## 4. What *can* be learned from the image (visual reference only)

These are observations to guide data requests. They are **not** data to import.

- **Layout:** An irregular scheme bounded to the north by a canal and a road parallel to it.
  The main boulevards cross near the centre, with roundabouts at the main junctions.
- **Sectors:** Several lettered sectors. Some areas are colored differently
  (orange/tan, blue, yellow). Sector C also has a "Large View 8-Marla C-Block" inset.
- **Commercial:** Pink commercial strips with codes such as `CA-00x`, `CB-00x`, `CN-00x`,
  plus a "Mall".
- **Amenities / POIs (candidate layer list):** Jamia Masjid, DHA Club & Allied Facilities,
  DHA Office Complex, Army Officers Housing Scheme (AOHS), Edn Enclave, SKMT site,
  adjacent Cholistan University of Veterinary & Animal Sciences, main gate, and many parks.
- **Legend:** A color legend is present at the top right but cannot be read at this
  resolution. Plot status or category (e.g. developed/undeveloped, marla size) **cannot**
  be confirmed.
- **Obstructions:** Large parts of the left side and bottom strip are covered by the
  agency's contact panel, photos, the location-plan inset and the sectors-layout inset.
  The map is therefore **incomplete** even as a picture.
- **Scale:** No scale bar. Brochure maps are often stretched or simplified, so this one
  should be assumed **not to scale** until checked against satellite imagery.

---

## 5. Conversion paths

### Path A (preferred) — obtain authority vector data
Ask DHA Bahawalpur (Town Planning / GIS / IT) for the layout plan in any of:
DWG/DXF, Shapefile, GeoPackage, GeoJSON, KML/KMZ, or a GeoPDF.

Then: inspect the CRS (likely UTM zone 42N/43N (Bahawalpur ≈ 71.7°E sits near the
zone boundary) or a local grid; **to be confirmed, not assumed**) → import into PostGIS
→ validate per `03-gis-data-and-map.md` §5.

Effort: low to moderate, depending on attribute quality.

### Path B — georeference and digitize an official high-resolution plan
Needs an **official**, full-resolution plan (≥ 300 dpi scan or vector PDF) with
readable plot numbers.

1. Collect ground control points (GCPs): well-spread road intersections,
   roundabouts, canal bridges. Use licensed satellite imagery and/or field GPS surveys.
2. Georeference in QGIS (polynomial/thin-plate spline) and record RMS error.
3. Digitize sectors, blocks, roads (as a connected network for routing), plots, and POIs.
4. Attribute plot numbers, sector, block, street, and type from the plan.
5. Run topology and data-quality checks. Field-verify a sample of plots with GPS.

Effort: **high**. The scheme has thousands of plots. Accuracy depends on the GCPs
and on how distorted the plan is.

### Path C — this brochure image
**Not viable** for plot-level GPS accuracy, plot search, or routing (see §3).
It could at most support a rough, non-authoritative overlay for a demo, and even
that would raise licensing concerns (§8).

---

## 6. Information to request from DHA Bahawalpur

1. Official layout/master plan in vector GIS or CAD format, with CRS stated.
2. Plot register export: plot number, sector, block, street, plot type/size, and status,
   with a key that links each record to its geometry.
3. Road centrelines, if they exist, and any one-way or gated-access rules.
4. Survey control points or benchmarks inside the scheme.
5. Which plot fields and statuses are approved to show publicly.
6. Update frequency, and who approves data releases.
7. Written permission or licence to use the data in the app.

---

## 7. Routing and basemap (preliminary; decisions deferred)

- Routing needs a connected road network (`03` §9). The brochure cannot provide one.
- **Open action:** check OpenStreetMap coverage of DHA Bahawalpur roads. This could not be
  checked from this environment because outbound access to openstreetmap.org and
  Overpass was blocked. If OSM coverage is good, it could supply the basemap and roads
  *outside* the scheme, and possibly *inside* it, subject to verification.
- Routing engine (OSRM / GraphHopper / Valhalla / managed API) and basemap provider:
  **not decided**. Flagged in `11-open-decisions.md`.

---

## 8. Legal / data-handling notes

- The image carries a private agency's branding, staff names and phone numbers. None of
  it should appear in the app, and it should not be redistributed.
- DHA branding and map content are third-party IP. Get authority permission before
  any production use.
- Per `12-folder-structure.md`, source maps are **not committed** to this repository.
  `gis/source/` holds only a README.

---

## 9. Milestone 0 checklist status

| Task | Status |
|---|---|
| Collect source map | Partial: brochure only; official source still needed |
| Identify file format | Done: JPEG raster |
| Inspect map quality | Done: low resolution, partly covered, not to scale |
| Determine if georeferenced | Done: not georeferenced |
| Identify CRS | Blocked: none in source |
| Identify plot boundaries | Blocked: not extractable |
| Identify roads | Partial: main roads visible, not routable |
| Identify sector/block boundaries | Partial: sector letters visible, boundaries implied |
| Identify street/lane data | Blocked |
| Identify plot attributes | Blocked: plot numbers unreadable |
| Identify routing requirements | Open: see §7 |
| Android-only vs Android+iOS | Open |
| Public vs authenticated app | Open |
| Routing provider/engine | Open |
| Basemap provider | Open |
| Review licensing | Open: see §8 |
| Produce technical feasibility report | Done: this document (draft) |

**Exit criterion not yet met.** It can be met once the §6 data request is answered
and one of Path A or Path B is confirmed.
