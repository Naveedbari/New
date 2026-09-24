# Housing Map — DHA Bahawalpur

Mobile map and plot-navigation app for a housing authority. The first target scheme
is DHA Bahawalpur.

This folder is separate from the portfolio site at the repository root. It does not
affect the site's build or deployment.

## Contents

| Path | What |
|---|---|
| `docs/` | Specification v0.1 (`00`–`12`), `GIS-Feasibility-Report.md` (M0), `Milestone-1-Notes.md` |
| `api/` | ASP.NET Core 10 API + PostGIS ([README](api/README.md)) |
| `mobile/` | Ionic Angular + Capacitor Android app ([README](mobile/README.md)) |
| `gis/fixtures/` | **Synthetic** development dataset (not real data) |
| `gis/scripts/` | Fixture generator |
| `gis/source/` | Placeholder only. Source maps are never committed |
| `docker-compose.yml` | Local PostGIS |

## Quick start

```bash
docker compose up -d                                   # PostGIS on :5432
cd api && dotnet run --project src/HousingMap.Api      # API on :5095, migrates + seeds dev data
cd mobile && npm ci && npm start                       # App on :4200
```

## Status

- **Milestone 0** (feasibility): open. Only a low-resolution brochure image was supplied, so the
  official DHA Bahawalpur layout data is still needed. See `docs/GIS-Feasibility-Report.md` §6.
- **Milestone 1** (foundation): done with synthetic data. See `docs/Milestone-1-Notes.md`.
