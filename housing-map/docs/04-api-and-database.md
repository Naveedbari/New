# Backend API and Database Specification

## 1. API principles

- REST API
- JSON
- HTTPS only
- Versioned API, e.g. `/api/v1`
- Pagination
- Consistent error format
- Authentication for protected endpoints
- Authorization on every admin endpoint
- Request validation
- Rate limiting where appropriate
- Logging without sensitive data

## 2. Suggested endpoints

### Search
```text
GET /api/v1/search/plots?q=
GET /api/v1/search/plots?sectorId=&streetId=&plotNumber=
GET /api/v1/search/roads?q=
GET /api/v1/search/sectors?q=
```

### Plot
```text
GET /api/v1/plots/{id}
GET /api/v1/plots/{id}/geometry
GET /api/v1/plots/{id}/nearby
```

### Map
```text
GET /api/v1/map/layers
GET /api/v1/map/features?bbox=
GET /api/v1/map/plots?bbox=
```

### Routing
```text
POST /api/v1/routes
```

Request:
```json
{
  "origin": {
    "latitude": 0,
    "longitude": 0
  },
  "destination": {
    "latitude": 0,
    "longitude": 0
  },
  "mode": "driving"
}
```

### Admin
```text
POST /api/v1/admin/gis/import
GET  /api/v1/admin/gis/imports
GET  /api/v1/admin/gis/imports/{id}
POST /api/v1/admin/gis/imports/{id}/validate
POST /api/v1/admin/gis/imports/{id}/publish
POST /api/v1/admin/gis/datasets/{id}/rollback
```

## 3. Authentication endpoints

If login is required:
```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

## 4. Database

Recommended:
- PostgreSQL
- PostGIS

Core tables:
- users
- roles
- permissions
- user_roles
- sectors
- blocks
- streets
- roads
- plots
- points_of_interest
- gis_datasets
- gis_imports
- gis_import_errors
- audit_logs

## 5. Data versioning

GIS data must be versioned.

Example:
```text
Dataset 2026-09-01
Dataset 2026-10-01
Dataset 2026-11-15
```

Only one dataset/version should be marked as production-active.

## 6. Security

- Password hashing with a modern approved algorithm
- Short-lived access tokens
- Secure refresh-token strategy
- HTTPS
- Input validation
- SQL injection protection through parameterized ORM/query APIs
- Authorization policies
- File upload validation
- GIS import sandboxing
- Audit logs
- Secrets stored outside source code

## 7. API response example

```json
{
  "id": "plot-12345",
  "plotNumber": "125",
  "sector": "B",
  "street": "4",
  "road": "Main Road",
  "status": "Allocated",
  "area": 500,
  "center": {
    "latitude": 0,
    "longitude": 0
  }
}
```

Coordinates above are illustrative only.
