import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

const DB_NAME = 'icl_db';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logo TEXT,
  name TEXT NOT NULL,
  captain_name TEXT NOT NULL,
  captain_phone TEXT NOT NULL,
  address TEXT,
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  season INTEGER,
  played_on TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ongoing',
  court_count INTEGER,
  champion_team_id INTEGER,
  champion_team_name TEXT,
  mvp_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tournament_pools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  court INTEGER,
  start_time TEXT,
  position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  pool_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  team1_id INTEGER,
  team1_name TEXT NOT NULL,
  team2_id INTEGER,
  team2_name TEXT NOT NULL,
  winner INTEGER
);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches (tournament_id);
CREATE TABLE IF NOT EXISTS pool_teams (
  pool_id INTEGER NOT NULL,
  team_id INTEGER,
  team_name TEXT NOT NULL,
  position INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pools_tournament ON tournament_pools (tournament_id);
CREATE INDEX IF NOT EXISTS idx_pool_teams_pool ON pool_teams (pool_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments (played_on);
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams (name);
CREATE INDEX IF NOT EXISTS idx_teams_captain ON teams (captain_name);
CREATE INDEX IF NOT EXISTS idx_teams_phone ON teams (captain_phone);
`;

/**
 * On-device SQLite database. On Android/iOS it uses native SQLite; in the
 * browser (ionic serve) it falls back to jeep-sqlite, which persists to IndexedDB.
 */
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private readonly isWeb = Capacitor.getPlatform() === 'web';
  private db!: SQLiteDBConnection;

  async init(): Promise<void> {
    if (this.isWeb) {
      await this.initWebStore();
    }

    const consistency = await this.sqlite.checkConnectionsConsistency();
    const exists = (await this.sqlite.isConnection(DB_NAME, false)).result;
    this.db =
      consistency.result && exists
        ? await this.sqlite.retrieveConnection(DB_NAME, false)
        : await this.sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);

    await this.db.open();
    await this.db.execute(SCHEMA);
    await this.persist();
  }

  async query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    const res = await this.db.query(sql, params);
    return (res.values ?? []) as T[];
  }

  async run(sql: string, params: unknown[] = []): Promise<number | undefined> {
    const res = await this.db.run(sql, params);
    await this.persist();
    return res.changes?.lastId;
  }

  /** Runs several dependent writes in one transaction, persisting once at the end. */
  async transaction<T>(work: (run: (sql: string, params?: unknown[]) => Promise<number | undefined>) => Promise<T>): Promise<T> {
    await this.db.beginTransaction();
    try {
      const result = await work(async (sql, params = []) => (await this.db.run(sql, params, false)).changes?.lastId);
      await this.db.commitTransaction();
      await this.persist();
      return result;
    } catch (e) {
      await this.db.rollbackTransaction();
      throw e;
    }
  }

  private async persist(): Promise<void> {
    if (this.isWeb) {
      await this.sqlite.saveToStore(DB_NAME);
    }
  }

  private async initWebStore(): Promise<void> {
    const { defineCustomElements } = await import('jeep-sqlite/loader');
    await defineCustomElements(window);
    if (!document.querySelector('jeep-sqlite')) {
      const el = document.createElement('jeep-sqlite');
      el.setAttribute('autoSave', 'true');
      el.setAttribute('wasmPath', 'assets');
      document.body.appendChild(el);
    }
    await customElements.whenDefined('jeep-sqlite');
    await this.sqlite.initWebStore();
  }
}
