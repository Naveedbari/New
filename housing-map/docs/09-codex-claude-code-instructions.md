# Coding Agent Instructions

This file is intended to be given to Codex / Claude Code alongside the project specification.

## 1. Development behavior

Do not attempt to build the entire product in one pass.

Work milestone-by-milestone.

Before starting a milestone:
1. Read all specification files.
2. Inspect the current repository.
3. Identify completed work.
4. Identify missing dependencies.
5. Confirm assumptions from existing code/configuration.
6. Implement only the current milestone unless a dependency requires a small prerequisite.

## 2. Critical GIS rule

Never invent plot coordinates, road geometry, sector boundaries, or other geographic data.

If the real authority dataset has not been supplied:
- Create schemas/interfaces/sample fixtures only.
- Clearly label fixtures as development data.
- Do not present sample coordinates as real.

## 3. Architecture

Keep responsibilities separated:

```text
Mobile UI
  -> Application services
  -> API client
  -> Backend API
  -> Application layer
  -> Domain
  -> Infrastructure
  -> PostGIS
```

Avoid putting:
- database logic in controllers
- API calls directly in UI components
- GIS transformation logic in map components
- business rules in Angular templates

## 4. Code quality

Use:
- meaningful names
- small functions
- typed DTOs
- validation
- error handling
- async/await where appropriate
- cancellation/cleanup for subscriptions/watchers
- unit tests for business logic

Avoid:
- `any` unless unavoidable
- magic numbers
- hard-coded production URLs
- hard-coded coordinates
- duplicated API logic
- giant components
- giant service classes

## 5. GIS safety

Every spatial operation must document:
- input geometry
- CRS
- output geometry
- coordinate order
- precision expectations

Be especially careful about latitude/longitude order.

## 6. Mobile map performance

Do not render thousands of detailed polygons unnecessarily.

Use:
- viewport queries
- clustering
- vector tiles or optimized feature delivery
- zoom-based layer visibility
- simplified geometry at lower zoom levels

## 7. Location privacy

Do not persist user location history unless explicitly required.

Use location only for:
- showing current position
- route calculation
- navigation tracking

## 8. API security

Never trust:
- client-supplied role
- client-supplied permissions
- client-supplied ownership
- client-supplied GIS publication status

Validate on the server.

## 9. Database

Use migrations.

Never manually change production schema without a controlled migration.

Use spatial indexes for spatial queries.

## 10. Testing requirement

Every milestone must include appropriate tests.

For GIS:
- geometry validity
- CRS transformation
- spatial query correctness

For search:
- exact match
- partial match
- combined filters
- no results
- duplicate/ambiguous results

For GPS:
- permission denied
- unavailable
- inaccurate location

For routing:
- route available
- route unavailable
- deviation
- arrival

## 11. Definition of Done

A task is not complete merely because code compiles.

A task is complete when:
- implementation exists
- tests are added where applicable
- error states are handled
- no known console/runtime errors remain
- formatting/linting passes
- documentation is updated when behavior/architecture changes
- acceptance criteria are satisfied

## 12. Git discipline

Use small commits.

Recommended format:
```text
feat(map): add plot layer
feat(search): add plot search
feat(gps): add current location
feat(route): add route rendering
fix(gis): validate polygon geometry
```

## 13. Do not make premature decisions

If a requirement depends on:
- source map format
- GIS licensing
- routing provider
- production infrastructure
- authority privacy policy

do not silently invent a decision.

Document the assumption and flag it for approval.

## 14. First implementation target

The first coding target should NOT be navigation.

First prove:

```text
Real authority map
      ↓
Correct GIS coordinates
      ↓
PostGIS
      ↓
API
      ↓
Mobile map
      ↓
Correct plot search
      ↓
Correct plot highlighted
```

Only after this works should routing/navigation become the next major implementation target.
