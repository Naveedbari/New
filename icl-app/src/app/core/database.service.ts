import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

const DB_NAME = 'icl_db';

type SqlJsInit = (config: { locateFile: (file: string) => string }) => Promise<{ Database: new () => MemoryDb }>;

/** Tables saved in a backup file, parents before children. */
export const BACKUP_TABLES = ['users', 'settings', 'teams', 'tournaments', 'tournament_pools', 'pool_teams', 'matches'] as const;

/** The bits of a sql.js database the in-memory fallback uses (sql.js ships no types). */
interface MemoryDb {
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  prepare(sql: string): {
    bind(params: unknown[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, unknown>;
    run(params: unknown[]): void;
    free(): boolean;
  };
}

/**
 * Columns added after the first release. CREATE TABLE IF NOT EXISTS won't add
 * them to an existing database, so they are added here when missing.
 */
const ADDED_COLUMNS: Record<string, Record<string, string>> = {
  tournaments: { match_minutes: 'INTEGER', overs: 'INTEGER', qualify_count: 'INTEGER', ko_format: 'TEXT', champion_photo: 'TEXT' },
  tournament_pools: { booking_minutes: 'INTEGER' },
  matches: {
    toss_caller: 'INTEGER',
    toss_call: 'TEXT',
    toss_result: 'TEXT',
    toss_winner: 'INTEGER',
    toss_decision: 'TEXT',
    bat_first: 'INTEGER',
    inn1_runs: 'INTEGER',
    inn1_balls: 'INTEGER',
    inn2_runs: 'INTEGER',
    inn2_balls: 'INTEGER',
    /** Knockout round number (1 = first knockout round); NULL for pool matches. */
    ko_round: 'INTEGER',
  },
};

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
  match_minutes INTEGER,
  overs INTEGER,
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
  booking_minutes INTEGER,
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
  winner INTEGER,
  toss_caller INTEGER,
  toss_call TEXT,
  toss_result TEXT,
  toss_winner INTEGER,
  toss_decision TEXT
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
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
 * browser it uses jeep-sqlite, which persists to IndexedDB. If the browser blocks
 * storage (private windows, some in-app viewers), it falls back to an in-memory
 * sql.js database so the app still opens; nothing is kept after a reload.
 */
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private readonly isWeb = Capacitor.getPlatform() === 'web';
  private db!: SQLiteDBConnection;
  /** Set when browser storage is blocked and the in-memory fallback is in use. */
  private memory: MemoryDb | null = null;
  /** True when data will not survive a reload (storage blocked in this browser). */
  readonly temporary = signal(false);
  /** Bumped after every write, so screens can refresh (see data-sync.ts). */
  readonly changes = signal(0);

  async init(): Promise<void> {
    if (this.isWeb) {
      try {
        if (!(await browserStorageWorks())) throw new Error('IndexedDB is blocked');
        // jeep-sqlite can log a storage error and never settle, so don't wait forever.
        await withTimeout(this.openSqlite(), 10000);
      } catch (e) {
        console.warn('Browser storage unavailable, using a temporary in-memory database', e);
        await this.openMemory();
      }
    } else {
      await this.openSqlite();
    }
    await this.execute(SCHEMA);
    await this.migrate();
    await this.persist();
  }

  private async openSqlite(): Promise<void> {
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
  }

  private async openMemory(): Promise<void> {
    // sql.js is loaded as a plain script (its bundle can't be built for the browser by esbuild).
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/sql-wasm.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load sql.js'));
      document.head.appendChild(script);
    });
    const initSqlJs = (window as unknown as { initSqlJs: SqlJsInit }).initSqlJs;
    const SQL = await initSqlJs({ locateFile: (file) => `assets/${file}` });
    this.memory = new SQL.Database();
    this.temporary.set(true);
  }

  private async execute(sql: string): Promise<void> {
    if (this.memory) this.memory.exec(sql);
    else await this.db.execute(sql);
  }

  async query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (this.memory) {
      const stmt = this.memory.prepare(sql);
      try {
        stmt.bind(sqlParams(params));
        const rows: T[] = [];
        while (stmt.step()) rows.push(stmt.getAsObject() as T);
        return rows;
      } finally {
        stmt.free();
      }
    }
    const res = await this.db.query(sql, params);
    return (res.values ?? []) as T[];
  }

  async run(sql: string, params: unknown[] = []): Promise<number | undefined> {
    if (this.memory) {
      const id = this.memoryRun(sql, params);
      this.changed();
      return id;
    }
    const res = await this.db.run(sql, params);
    await this.persist();
    this.changed();
    return res.changes?.lastId;
  }

  /** Runs several dependent writes in one transaction, persisting once at the end. */
  async transaction<T>(work: (run: (sql: string, params?: unknown[]) => Promise<number | undefined>) => Promise<T>): Promise<T> {
    if (this.memory) {
      const mem = this.memory;
      mem.exec('BEGIN');
      try {
        const result = await work(async (sql, params = []) => this.memoryRun(sql, params));
        mem.exec('COMMIT');
        this.changed();
        return result;
      } catch (e) {
        mem.exec('ROLLBACK');
        throw e;
      }
    }
    await this.db.beginTransaction();
    try {
      const result = await work(async (sql, params = []) => (await this.db.run(sql, params, false)).changes?.lastId);
      await this.db.commitTransaction();
      await this.persist();
      this.changed();
      return result;
    } catch (e) {
      await this.db.rollbackTransaction();
      throw e;
    }
  }

  private changed(): void {
    this.changes.update((n) => n + 1);
  }

  private memoryRun(sql: string, params: unknown[]): number | undefined {
    const mem = this.memory!;
    const stmt = mem.prepare(sql);
    try {
      stmt.run(sqlParams(params));
    } finally {
      stmt.free();
    }
    return mem.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] as number | undefined;
  }

  private async persist(): Promise<void> {
    if (this.isWeb && !this.memory) {
      await this.sqlite.saveToStore(DB_NAME);
    }
  }

  /** Every table's rows, for a backup file. */
  async exportAll(): Promise<Record<string, Record<string, unknown>[]>> {
    const tables: Record<string, Record<string, unknown>[]> = {};
    for (const table of BACKUP_TABLES) tables[table] = await this.query(`SELECT * FROM ${table}`);
    return tables;
  }

  /**
   * Replaces all data with a backup's rows, in one transaction (all or nothing). Columns the
   * backup has but this version doesn't are skipped; columns it lacks are left NULL.
   */
  async importAll(tables: Record<string, Record<string, unknown>[]>): Promise<void> {
    const columns = new Map<string, Set<string>>();
    for (const table of BACKUP_TABLES) {
      columns.set(table, new Set((await this.query<{ name: string }>(`PRAGMA table_info(${table})`)).map((c) => c.name)));
    }
    await this.transaction(async (run) => {
      for (const table of BACKUP_TABLES) await run(`DELETE FROM ${table}`);
      for (const table of BACKUP_TABLES) {
        const known = columns.get(table)!;
        for (const row of tables[table] ?? []) {
          const cols = Object.keys(row).filter((c) => known.has(c));
          if (!cols.length) continue;
          await run(
            `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
            cols.map((c) => row[c]),
          );
        }
      }
    });
  }

  private async migrate(): Promise<void> {
    for (const [table, columns] of Object.entries(ADDED_COLUMNS)) {
      const existing = new Set(
        (await this.query<{ name: string }>(`PRAGMA table_info(${table})`)).map((c) => c.name),
      );
      for (const [column, type] of Object.entries(columns)) {
        if (!existing.has(column)) {
          await this.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
        }
      }
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

/** sql.js rejects `undefined` and booleans; SQLite stores them as NULL and 0/1. */
function sqlParams(params: unknown[]): unknown[] {
  return params.map((v) => (v === undefined ? null : typeof v === 'boolean' ? Number(v) : v));
}

/** Whether IndexedDB (where jeep-sqlite keeps the database) can be opened in this browser. */
function browserStorageWorks(): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 3000);
    const done = (ok: boolean): void => {
      clearTimeout(timer);
      resolve(ok);
    };
    try {
      const req = indexedDB.open('icl_storage_probe');
      req.onsuccess = () => {
        req.result.close();
        done(true);
      };
      req.onerror = () => done(false);
      req.onblocked = () => done(true);
    } catch {
      done(false);
    }
  });
}

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms)),
  ]);
}
