import { Injectable, inject, signal } from '@angular/core';
import { DatabaseService } from './database.service';

export interface LeagueSettings {
  /** How long one match takes, including changeover. */
  matchMinutes: number;
  oversPerMatch: number;
  /** Default court booking length for a pool. */
  bookingMinutes: number;
}

export const DEFAULT_SETTINGS: LeagueSettings = {
  matchMinutes: 30,
  oversPerMatch: 6,
  bookingMinutes: 120,
};

const KEYS: Record<keyof LeagueSettings, string> = {
  matchMinutes: 'match_minutes',
  oversPerMatch: 'overs_per_match',
  bookingMinutes: 'booking_minutes',
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly db = inject(DatabaseService);
  readonly settings = signal<LeagueSettings>(DEFAULT_SETTINGS);

  async load(): Promise<void> {
    const rows = await this.db.query<{ key: string; value: string }>('SELECT key, value FROM settings');
    const stored = new Map(rows.map((r) => [r.key, Number(r.value)]));
    const next = { ...DEFAULT_SETTINGS };
    for (const [field, key] of Object.entries(KEYS) as [keyof LeagueSettings, string][]) {
      const v = stored.get(key);
      if (v && Number.isFinite(v) && v > 0) next[field] = v;
    }
    this.settings.set(next);
  }

  async save(value: LeagueSettings): Promise<void> {
    for (const [field, key] of Object.entries(KEYS) as [keyof LeagueSettings, string][]) {
      await this.db.run(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, String(value[field])],
      );
    }
    this.settings.set({ ...value });
  }
}
