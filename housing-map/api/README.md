# Housing Map API

ASP.NET Core 10 Web API with PostgreSQL 16 + PostGIS 3.4.

## Layout (Clean Architecture)

| Project | Responsibility |
|---|---|
| `src/HousingMap.Domain` | Entities (`Plot`, `Sector`, `Block`, `Street`, `Road`, `PointOfInterest`, `GisDataset`) and enums. No infrastructure. |
| `src/HousingMap.Application` | Use-case interfaces and DTOs (e.g. `IDatasetQueries`). |
| `src/HousingMap.Infrastructure` | EF Core + Npgsql + NetTopologySuite, migrations, health checks, development seeder. |
| `src/HousingMap.Api` | HTTP host: controllers, API versioning, health endpoints, error handling, CORS. |
| `tests/HousingMap.UnitTests` | Tests without a database (fixture reader, geometry rules). |
| `tests/HousingMap.IntegrationTests` | Tests against a real PostGIS database via `WebApplicationFactory`. |

Package versions are pinned centrally in `Directory.Packages.props`. Warnings are errors (`Directory.Build.props`).

## Run locally

```bash
docker compose -f ../docker-compose.yml up -d     # or any local PostGIS 16 with the same credentials
dotnet run --project src/HousingMap.Api            # http://localhost:5095
```

In `Development` the API applies migrations and loads the **synthetic** dataset from
`../gis/fixtures/dev-sample-scheme` on startup. Both are switched off in Staging/Production. If
`Database:SeedDevelopmentData` is ever enabled outside Development, startup fails on purpose (AC-15).

Production configuration comes from environment variables, e.g.
`ConnectionStrings__HousingMap=...`. No production secrets live in the repository.

## Endpoints (Milestone 1)

| Method | Path | Purpose |
|---|---|---|
| GET | `/health/live` | Process is up (no dependency checks) |
| GET | `/health/ready` | Database and PostGIS reachable |
| GET | `/api/v1/system/info` | API version, environment, active dataset + feature counts |
| GET | `/openapi/v1.json` | OpenAPI document (Development only) |

Errors are RFC 7807 `application/problem+json`, with no stack traces.

## Tests

```bash
dotnet test HousingMap.slnx
```

Integration tests **drop and recreate** the database named in `HOUSINGMAP_TEST_CONNECTION`
(default `Host=localhost;Database=housingmap_test;Username=housingmap;Password=housingmap_dev`).
The user needs rights to create databases and the PostGIS extension.

## Migrations

```bash
dotnet tool restore
dotnet ef migrations add <Name> -p src/HousingMap.Infrastructure -s src/HousingMap.Api -o Persistence/Migrations
```

## Spatial conventions

- Stored CRS: **EPSG:4326** (WGS 84). NetTopologySuite `X = longitude`, `Y = latitude`.
- Polygons are stored as `MultiPolygon`, lines as `MultiLineString`, so one column type fits all source data.
- Each geometry column has a GiST index. Features belong to a `gis_datasets` version, and only one dataset can be active.
- The CRS of the real authority data is **not known yet** (see `docs/GIS-Feasibility-Report.md`). If it arrives in a
  projected CRS (for example UTM), transform it during import and keep the original in the import record.
