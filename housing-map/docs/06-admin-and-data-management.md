# Admin / GIS Management Requirements

## 1. Why admin tooling is required

The mobile app depends on authoritative map data. A controlled way to update and validate that data is necessary.

The admin portal can be a separate web application.

Recommended:
- Angular admin portal
- Same ASP.NET Core API
- Same PostgreSQL/PostGIS database

## 2. Admin dashboard

Show:
- Active GIS dataset
- Dataset version
- Import history
- Failed imports
- Number of plots
- Number of roads
- Number of sectors
- Last update
- System health

## 3. GIS import

Admin can:
1. Select file.
2. Upload.
3. Select source type.
4. Map fields.
5. Review detected CRS.
6. Run validation.
7. Review errors/warnings.
8. Preview on map.
9. Approve.
10. Publish.

## 4. Import status

```text
Uploaded
Processing
Validation Failed
Ready for Review
Approved
Published
Rolled Back
```

## 5. Validation report

Example:

```text
Plots:
Total: 15,420
Valid: 15,390
Errors: 12
Warnings: 18

Errors:
- 5 missing plot numbers
- 3 invalid geometries
- 4 missing sector references
```

## 6. Dataset rollback

If a published dataset causes a problem:
- Admin selects previous version
- System verifies compatibility
- Previous version becomes active
- New version becomes inactive
- Audit event is recorded

## 7. Manual correction

Optional and should be controlled:
- Edit plot attribute
- Edit geometry
- Move point
- Rename road
- Correct sector

All manual changes must be audited.

## 8. Permissions

Example:
- GIS Viewer
- GIS Editor
- GIS Publisher
- Administrator
- Super Administrator

Publishing should require a higher permission than uploading.
