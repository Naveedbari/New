import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { AuthService } from './auth.service';
import { BACKUP_TABLES, DatabaseService } from './database.service';
import { SettingsService } from './settings.service';

const FORMAT = 'icl-backup';
const VERSION = 1;

interface BackupFile {
  format: typeof FORMAT;
  version: number;
  createdAt: string;
  tables: Record<string, Record<string, unknown>[]>;
}

export interface BackupSummary {
  teams: number;
  tournaments: number;
  createdAt: string;
}

/** Saves all app data to a JSON file and restores it, so data survives a reinstall or a new phone. */
@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly db = inject(DatabaseService);
  private readonly auth = inject(AuthService);
  private readonly settings = inject(SettingsService);

  /**
   * Writes a backup. On the phone it is saved to Documents/ICL and the share sheet opens (to send
   * it to WhatsApp, Drive, email…); in the browser it downloads. Returns where it was saved.
   */
  async export(): Promise<string> {
    const backup: BackupFile = {
      format: FORMAT,
      version: VERSION,
      createdAt: new Date().toISOString(),
      tables: await this.db.exportAll(),
    };
    const json = JSON.stringify(backup);
    const stamp = backup.createdAt.slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
    const fileName = `ICL-backup-${stamp}.json`;

    if (!Capacitor.isNativePlatform()) {
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return 'Downloads';
    }

    try {
      const perm = await Filesystem.checkPermissions();
      if (perm.publicStorage !== 'granted') await Filesystem.requestPermissions();
    } catch {
      /* not needed on newer Android */
    }
    let where = 'Documents › ICL';
    let saved;
    try {
      saved = await Filesystem.writeFile({ path: `ICL/${fileName}`, data: json, directory: Directory.Documents, encoding: Encoding.UTF8, recursive: true });
    } catch {
      saved = await Filesystem.writeFile({ path: fileName, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
      where = '';
    }
    try {
      await Share.share({ title: 'ICL backup', text: 'ICL app backup', files: [saved.uri], dialogTitle: 'Save or send your ICL backup' });
    } catch {
      /* closing the share sheet is fine: the file is already saved */
    }
    return where;
  }

  /** Reads a backup file and checks it is an ICL backup; throws a readable message otherwise. */
  async read(file: File): Promise<{ backup: BackupFile; summary: BackupSummary }> {
    let backup: BackupFile;
    try {
      backup = JSON.parse(await file.text());
    } catch {
      throw new Error('This file is not an ICL backup.');
    }
    if (backup?.format !== FORMAT || typeof backup.tables !== 'object' || !Array.isArray(backup.tables['teams'])) {
      throw new Error('This file is not an ICL backup.');
    }
    if (backup.version > VERSION) throw new Error('This backup was made by a newer version of the app. Update the app first.');
    return {
      backup,
      summary: {
        teams: backup.tables['teams']?.length ?? 0,
        tournaments: backup.tables['tournaments']?.length ?? 0,
        createdAt: backup.createdAt,
      },
    };
  }

  /** Replaces all current data with the backup. */
  async restore(backup: BackupFile): Promise<void> {
    const tables: Record<string, Record<string, unknown>[]> = {};
    for (const t of BACKUP_TABLES) tables[t] = Array.isArray(backup.tables[t]) ? backup.tables[t] : [];
    await this.db.importAll(tables);
    await this.auth.load();
    await this.settings.load();
  }
}
