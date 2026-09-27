import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from './database.service';
import { confirmAction } from './confirm';
import { AppUser } from './models';

const SESSION_KEY = 'icl_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly db = inject(DatabaseService);
  private readonly alerts = inject(AlertController);
  private readonly router = inject(Router);

  readonly user = signal<AppUser | null>(null);
  readonly loggedIn = signal(false);

  /** Loads the registered user (if any) and restores the current session. */
  async load(): Promise<void> {
    const rows = await this.db.query<{ id: number; username: string; pin_hash: string; salt: string }>(
      'SELECT id, username, pin_hash, salt FROM users ORDER BY id LIMIT 1',
    );
    const row = rows[0];
    this.user.set(
      row ? { id: row.id, username: row.username, pinHash: row.pin_hash, salt: row.salt } : null,
    );
    this.loggedIn.set(!!row && readSession() === String(row.id));
  }

  hasAccount(): boolean {
    return this.user() !== null;
  }

  async register(username: string, pin: string): Promise<void> {
    if (this.hasAccount()) {
      throw new Error('An account already exists on this device.');
    }
    const salt = randomSalt();
    const pinHash = await hashPin(pin, salt);
    await this.db.run('INSERT INTO users (username, pin_hash, salt) VALUES (?, ?, ?)', [
      username.trim(),
      pinHash,
      salt,
    ]);
    await this.load();
    this.startSession();
  }

  async login(pin: string): Promise<boolean> {
    const user = this.user();
    if (!user) return false;
    const ok = (await hashPin(pin, user.salt)) === user.pinHash;
    if (ok) this.startSession();
    return ok;
  }

  logout(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    this.loggedIn.set(false);
  }

  /** Asks for confirmation, then logs out and returns to the PIN screen. */
  async confirmLogout(): Promise<void> {
    if (await confirmAction(this.alerts, 'Logout', 'You will need your PIN to log in again.', 'Logout')) {
      this.logout();
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  private startSession(): void {
    const user = this.user();
    if (!user) return;
    try {
      localStorage.setItem(SESSION_KEY, String(user.id));
    } catch {}
    this.loggedIn.set(true);
  }
}

function readSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
