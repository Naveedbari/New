# Recommended Repository Structure

If a monorepo is preferred:

```text
housing-map/
│
├── docs/
│   ├── 00-project-overview.md
│   ├── 01-product-requirements.md
│   ├── 02-functional-requirements.md
│   ├── 03-gis-data-and-map.md
│   ├── 04-api-and-database.md
│   ├── 05-mobile-app-spec.md
│   ├── 06-admin-and-data-management.md
│   ├── 07-milestones.md
│   ├── 08-task-breakdown.md
│   ├── 09-codex-claude-code-instructions.md
│   ├── 10-acceptance-criteria.md
│   └── 11-open-decisions.md
│
├── mobile/
│   └── Ionic Angular app
│
├── api/
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   └── API/
│
├── admin/
│   └── Angular admin portal
│
├── gis/
│   ├── source/
│   ├── staging/
│   ├── processed/
│   ├── validation/
│   └── scripts/
│
├── tests/
│   ├── api/
│   ├── mobile/
│   └── gis/
│
└── README.md
```

## Important

Do not commit confidential authority GIS source files to a public Git repository.

Use secure storage for source GIS files and production exports.
