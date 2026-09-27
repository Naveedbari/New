# ICL — Indoor Champion League

Ionic + Angular mobile app (Capacitor) for running an indoor league. All data is stored
on the device in SQLite (`@capacitor-community/sqlite`; in the browser it falls back to
jeep-sqlite / IndexedDB).

## Features

- **Welcome / PIN login**: the first launch asks for a username and a 4–6 digit PIN.
  After logout, the PIN is needed to log back in. The PIN is stored as a salted SHA-256 hash.
- **Home**: the most recent completed tournament's champion (logo, team name, MVP, date),
  plus previous champions.
- **Teams**: add, edit and delete teams (logo, name, captain name, captain phone, address,
  comment). Search by team name, captain name or captain phone.
- **Start new tournament** (3 steps):
  1. The season number is suggested automatically (last season + 1 → "ICL Season N").
     Then select the participating teams.
  2. Enter the number of pools and courts. Teams are split evenly, e.g. 8 teams / 2 pools → 4 + 4.
  3. The app randomly draws teams into pools and gives each pool a court (Court A, B, …).
     When there are more pools than courts, pools share courts. Enter each pool's start
     time (court booking), reshuffle if you like, then start.
- **Fixtures**: round-robin matches are generated for each pool in random order, avoiding
  back-to-back games where possible. Tap a match to record the winner. Results appear next
  to each match, with a wins/played summary per pool.
- **Declare champion & MVP**: completes the tournament, and it then appears on Home.

## Develop

```bash
npm install
npm start            # http://localhost:4200
npm run build
```

## Run on a device

```bash
npx cap add android   # or: npx cap add ios   (first time only)
npm run android       # build, sync and open Android Studio
npm run ios           # build, sync and open Xcode
```

`sql.js` is pinned to 1.11.0 because `public/assets/sql-wasm.wasm` (copied at build time)
must match the version bundled inside jeep-sqlite.
