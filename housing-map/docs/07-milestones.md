# Project Milestones and Development Plan

## Milestone 0 — Discovery & Feasibility

### Goal
Confirm that the supplied housing map can become usable GIS data.

### Tasks
- [ ] Collect source map
- [ ] Identify file format
- [ ] Inspect map quality
- [ ] Determine if georeferenced
- [ ] Identify CRS
- [ ] Identify plot boundaries
- [ ] Identify roads
- [ ] Identify sector/block boundaries
- [ ] Identify street/lane data
- [ ] Identify plot attributes
- [ ] Identify routing requirements
- [ ] Decide Android-only vs Android+iOS
- [ ] Decide public vs authenticated app
- [ ] Decide routing provider/engine
- [ ] Decide basemap provider
- [ ] Review licensing
- [ ] Produce technical feasibility report

### Deliverable
`GIS-Feasibility-Report.md`

### Exit criteria
The team can explain exactly how the supplied map will become searchable/georeferenced map data.

---

## Milestone 1 — Project Foundation

### Goal
Create maintainable application foundations.

### Tasks
- [ ] Create Git repositories
- [ ] Create branch strategy
- [ ] Create Ionic Angular project
- [ ] Create ASP.NET Core API
- [ ] Create admin Angular project if approved
- [ ] Configure environments
- [ ] Configure coding standards
- [ ] Configure linting/formatting
- [ ] Configure CI build
- [ ] Configure basic unit-test framework
- [ ] Create architecture folders
- [ ] Create API versioning
- [ ] Create health endpoint
- [ ] Create database project/migrations
- [ ] Configure PostgreSQL/PostGIS
- [ ] Create development seed data

### Exit criteria
Mobile, API and database build successfully from a clean checkout.

---

## Milestone 2 — GIS Data Pipeline

### Goal
Convert the authority's source data into validated spatial data.

### Tasks
- [ ] Implement source-file parser/importer
- [ ] Implement CRS detection/configuration
- [ ] Implement geometry validation
- [ ] Implement attribute mapping
- [ ] Create sector/block import
- [ ] Create street/lane import
- [ ] Create road import
- [ ] Create plot import
- [ ] Create POI import
- [ ] Implement duplicate checks
- [ ] Implement orphan checks
- [ ] Implement invalid geometry checks
- [ ] Implement dataset versioning
- [ ] Create import report
- [ ] Import first real dataset
- [ ] Validate against authority map

### Exit criteria
A validated GIS dataset exists in PostGIS and can be queried.

---

## Milestone 3 — Map Backend

### Goal
Expose spatial data efficiently through APIs.

### Tasks
- [ ] Implement plot APIs
- [ ] Implement sector APIs
- [ ] Implement road APIs
- [ ] Implement street APIs
- [ ] Implement POI APIs
- [ ] Implement map viewport/bbox API
- [ ] Implement layer configuration
- [ ] Add spatial indexes
- [ ] Add search indexes
- [ ] Add pagination
- [ ] Add API validation
- [ ] Add API error handling
- [ ] Add API integration tests
- [ ] Benchmark map queries

### Exit criteria
Mobile client can efficiently retrieve map/search data.

---

## Milestone 4 — Mobile Map MVP

### Goal
Display the housing scheme on mobile.

### Tasks
- [ ] Implement app shell
- [ ] Implement home/map screen
- [ ] Integrate map SDK
- [ ] Load basemap
- [ ] Load housing GIS layers
- [ ] Render roads
- [ ] Render sectors
- [ ] Render plots
- [ ] Add zoom/pan
- [ ] Add layer controls
- [ ] Add legend
- [ ] Add loading/error states
- [ ] Optimize rendering

### Exit criteria
User can visually explore the housing scheme on a phone.

---

## Milestone 5 — Plot Search

### Goal
Find any plot quickly.

### Tasks
- [ ] Implement search UI
- [ ] Implement plot number search
- [ ] Implement sector filter
- [ ] Implement block filter
- [ ] Implement street/lane filter
- [ ] Implement road filter
- [ ] Implement combined filters
- [ ] Implement search result ranking
- [ ] Implement empty results
- [ ] Implement recent searches
- [ ] Focus map on selected plot
- [ ] Highlight selected polygon
- [ ] Implement plot details panel

### Exit criteria
A tester can search a real plot and visually locate it correctly.

---

## Milestone 6 — GPS / Current Location

### Goal
Show where the user is.

### Tasks
- [ ] Request permission
- [ ] Handle permission denied
- [ ] Implement location service
- [ ] Display location marker
- [ ] Implement recenter
- [ ] Display accuracy where useful
- [ ] Handle GPS unavailable
- [ ] Handle mock/poor accuracy safely
- [ ] Optimize location update frequency
- [ ] Test outdoors at multiple points

### Exit criteria
GPS position is correctly displayed and behaves predictably.

---

## Milestone 7 — Routing & Navigation

### Goal
Guide the user from current location to a selected plot.

### Tasks
- [ ] Select routing engine/provider
- [ ] Prepare routable road network
- [ ] Verify local road coverage
- [ ] Implement route API/integration
- [ ] Implement route request
- [ ] Draw route
- [ ] Display distance
- [ ] Display ETA if supported
- [ ] Implement location tracking
- [ ] Implement off-route detection
- [ ] Implement rerouting
- [ ] Implement arrival detection
- [ ] Implement stop navigation
- [ ] Test multiple starting points
- [ ] Test road restrictions if relevant

### Exit criteria
A user can navigate from a real starting point to a real plot.

---

## Milestone 8 — Admin GIS Management

### Goal
Allow controlled map-data updates.

### Tasks
- [ ] Admin login
- [ ] Role/permission model
- [ ] GIS upload
- [ ] Import processing
- [ ] Validation report
- [ ] Map preview
- [ ] Approval workflow
- [ ] Publish workflow
- [ ] Dataset version history
- [ ] Rollback
- [ ] Audit log
- [ ] Import error viewer

### Exit criteria
An authorized admin can safely publish a new map dataset.

---

## Milestone 9 — Security & Production Hardening

### Tasks
- [ ] HTTPS
- [ ] Authentication hardening
- [ ] Authorization tests
- [ ] Secure token handling
- [ ] API rate limiting
- [ ] Input validation
- [ ] File upload security
- [ ] Audit logging
- [ ] Secrets management
- [ ] Database backup
- [ ] Disaster recovery plan
- [ ] Dependency vulnerability scan
- [ ] Privacy review
- [ ] Location-data retention review

### Exit criteria
Security checklist passes.

---

## Milestone 10 — Performance & Offline

### Tasks
- [ ] Map rendering benchmark
- [ ] Search benchmark
- [ ] API load test
- [ ] Large dataset test
- [ ] Cache recent searches
- [ ] Cache selected plot data
- [ ] Evaluate downloadable offline map
- [ ] Evaluate offline routing
- [ ] Reduce mobile data consumption
- [ ] Battery testing

### Exit criteria
Performance targets are met on representative devices.

---

## Milestone 11 — QA & UAT

### Tasks
- [ ] Functional testing
- [ ] GIS accuracy testing
- [ ] Search testing
- [ ] GPS testing
- [ ] Routing testing
- [ ] Permission testing
- [ ] Offline/error testing
- [ ] Android device matrix
- [ ] Regression testing
- [ ] Security testing
- [ ] Authority UAT
- [ ] Fix UAT issues
- [ ] Final sign-off

### Exit criteria
Authority signs off on release candidate.

---

## Milestone 12 — Production Release

### Tasks
- [ ] Production infrastructure
- [ ] Production database
- [ ] Production GIS dataset
- [ ] API deployment
- [ ] Admin deployment
- [ ] Mobile release build
- [ ] Store/internal distribution
- [ ] Monitoring
- [ ] Crash reporting
- [ ] Backup verification
- [ ] Rollback procedure
- [ ] User/admin documentation
- [ ] Handover

### Exit criteria
Production system is live and supportable.
