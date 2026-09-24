# Milestone 1 — Project Foundation: notes

Status: **implemented with synthetic development data**. Real authority data is still outstanding (Milestone 0).

## Delivered

| Task (07-milestones.md) | Where |
|---|---|
| Ionic Angular project | `mobile/` |
| ASP.NET Core API (Clean Architecture) | `api/` |
| Admin Angular project | **Not created**. "If approved" (open decision) |
| Environments | API `appsettings.{Development,Staging,Production}.json`; mobile `src/environments/` |
| Coding standards, lint/format | `api/.editorconfig` + analyzers as errors + `dotnet format`; mobile ESLint + Prettier |
| CI build | `.github/workflows/housing-map-ci.yml` (API with PostGIS service, mobile, fixture drift check) |
| Unit-test framework | xUnit (API), Vitest (mobile) |
| API versioning | `Asp.Versioning`, URL segment `/api/v1/...` |
| Health endpoint | `/health/live`, `/health/ready` (checks PostGIS) |
| Database migrations | EF Core, `api/src/HousingMap.Infrastructure/Persistence/Migrations` |
| PostgreSQL/PostGIS | `docker-compose.yml`; `geometry(...,4326)` columns with GiST indexes |
| Development seed data | `gis/fixtures/dev-sample-scheme` (synthetic, Null Island) + `DevelopmentDataSeeder` |

Exit criterion "mobile, API and database build from a clean checkout" is covered by CI.

## Assumptions to confirm (not silently decided)

| Assumption | Why | Change if |
|---|---|---|
| .NET 10 (LTS) | Current LTS; spec says ASP.NET Core without a version | Hosting requires another runtime |
| Angular 21 (not 22) | Angular 22 needs Node ≥ 22.22.3; 21 keeps Node 22 LTS contributors working | Team standardises on newer Node |
| Ionic 9 + Capacitor 8 | Current majors | — |
| Storage CRS EPSG:4326 | Needed by GPS and web maps | Authority data needs a projected CRS for area accuracy (then store both) |
| Guest (unauthenticated) read API | Auth decision is open, and M1 has no user data | Authority requires login (decide before Milestone 2) |
| Plot status is stored but not yet exposed | Status visibility is an open decision | Authority approves which statuses are public |
| App ID `com.example.housingmap` | Publisher unknown | Before the first store build |
| Monorepo inside the portfolio repo | Existing repository | Move `housing-map/` to its own repo when a team is assigned |

## Not in scope yet

Plot/search/map APIs (Milestone 3), map rendering (Milestone 4), GPS (Milestone 6), routing (Milestone 7),
admin portal and GIS import (Milestones 2 and 8).
