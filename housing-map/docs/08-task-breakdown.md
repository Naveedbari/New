# Detailed Development Task Breakdown

## Epic A — Mobile Foundation

### A-01
Create Ionic Angular application.

### A-02
Configure Capacitor Android.

### A-03
Create environment files:
- development
- staging
- production

### A-04
Create application shell:
- splash
- home
- settings

### A-05
Create shared UI components:
- loading
- error
- empty state
- bottom sheet
- search result
- map controls

---

## Epic B — API Foundation

### B-01
Create ASP.NET Core Web API.

### B-02
Create Clean Architecture projects:

```text
Domain
Application
Infrastructure
API
```

### B-03
Configure PostgreSQL/PostGIS.

### B-04
Create EF Core migrations.

### B-05
Create common API response/error model.

### B-06
Create health checks.

---

## Epic C — GIS

### C-01
Define GIS entity model.

### C-02
Create PostGIS geometry columns.

### C-03
Create spatial indexes.

### C-04
Create GIS import service.

### C-05
Create geometry validation.

### C-06
Create dataset versioning.

### C-07
Create import error reporting.

### C-08
Load authority dataset.

### C-09
Perform GIS accuracy validation.

---

## Epic D — Search

### D-01
Create plot search endpoint.

### D-02
Create sector search endpoint.

### D-03
Create road search endpoint.

### D-04
Create street/lane search endpoint.

### D-05
Create combined search.

### D-06
Create mobile search UI.

### D-07
Create result-to-map behavior.

---

## Epic E — Map

### E-01
Integrate map SDK.

### E-02
Load basemap.

### E-03
Load road layer.

### E-04
Load sector layer.

### E-05
Load plot layer.

### E-06
Load POIs.

### E-07
Implement viewport loading.

### E-08
Implement plot selection.

### E-09
Implement map legend.

### E-10
Implement layer visibility.

---

## Epic F — GPS

### F-01
Create location service.

### F-02
Permission handling.

### F-03
Current-location marker.

### F-04
Recenter.

### F-05
Accuracy handling.

### F-06
Location watcher lifecycle.

### F-07
Battery optimization.

---

## Epic G — Routing

### G-01
Select routing provider.

### G-02
Prepare road graph.

### G-03
Implement route endpoint.

### G-04
Create route request service.

### G-05
Draw route.

### G-06
Track user.

### G-07
Detect deviation.

### G-08
Recalculate route.

### G-09
Arrival detection.

### G-10
Stop navigation.

---

## Epic H — Admin

### H-01
Admin authentication.

### H-02
Roles and permissions.

### H-03
GIS upload UI.

### H-04
GIS validation UI.

### H-05
GIS preview.

### H-06
Publish workflow.

### H-07
Rollback.

### H-08
Audit log.

---

## Epic I — QA

### I-01
Unit tests.

### I-02
API integration tests.

### I-03
Mobile component tests.

### I-04
End-to-end tests.

### I-05
GIS data accuracy tests.

### I-06
GPS field tests.

### I-07
Routing field tests.

### I-08
Performance tests.

### I-09
Security tests.
