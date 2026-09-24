# Housing Map mobile app

Ionic 9 + Angular 21 (standalone components, signals, zoneless) + Capacitor 8 (Android).

## Run

```bash
npm ci
npm start            # http://localhost:4200, talks to the API at http://localhost:5095
```

Start the API first (see `../api/README.md`). The home screen shows service status and the active
dataset. The warning badge "Development sample data" means the synthetic fixture is loaded.

## Scripts

| Script | What it does |
|---|---|
| `npm start` | Dev server (development environment) |
| `npm run build` | Production build (`environment.prod.ts`) |
| `npm run build:staging` | Staging build |
| `npm test` | Unit tests (Vitest + jsdom) |
| `npm run lint` | ESLint (angular-eslint, including template accessibility rules) |
| `npm run format` / `format:check` | Prettier |
| `npm run cap:sync` | Build and copy web assets into the Android project |

## Environments

`src/environments/environment*.ts` hold the API base URL per environment. Staging and production
use `*.invalid` placeholder hosts until hosting is decided (open decision). This prevents a release
build from ever reaching a wrong server.

## Structure

```text
src/app/
  core/       config (APP_CONFIG), API client services, error mapping
  shared/ui/  loading / error / empty state components
  features/   home (status + map placeholder), settings
```

UI components never call `HttpClient` directly: pages → store/service → API service.

## Android

`android/` is the Capacitor project. To run it you need Android Studio / the Android SDK:

```bash
npm run cap:sync
npx cap open android
```

The development API runs over plain HTTP. On the Android emulator, use `http://10.0.2.2:5095` and allow
cleartext traffic for debug builds only. This will be configured with the map work in Milestone 4.
The application ID `com.example.housingmap` is a placeholder (open decision).
