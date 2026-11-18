import { Injectable, computed, inject, signal } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { State, emptyState } from './finance';

const KEY = 'group-ledger.v1';
const VIEW_KEY = 'group-ledger.view';

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback; } catch { return fallback; }
}

// ponytail: localStorage persistence on one device; swap run() for API calls when a backend/auth stack is chosen.
@Injectable({ providedIn: 'root' })
export class Store {
  private toast = inject(ToastController);
  readonly state = signal<State>(read(KEY, emptyState()));
  /** groupId -> memberId when previewing as a member; absent = Captain. */
  readonly viewAs = signal<Record<string, string>>(read(VIEW_KEY, {}));
  readonly user = 'Captain';

  /** Apply a pure command. Persist first, then publish: a failed write leaves state untouched. */
  run(cmd: (s: State) => State, success?: string): boolean {
    try {
      const next = cmd(this.state());
      localStorage.setItem(KEY, JSON.stringify(next));
      this.state.set(next);
      if (success) this.say(success, 'success');
      return true;
    } catch (e) {
      this.say((e as Error).message, 'danger');
      return false;
    }
  }

  setViewAs(groupId: string, memberId: string | null) {
    const v = { ...this.viewAs() };
    if (memberId) v[groupId] = memberId; else delete v[groupId];
    localStorage.setItem(VIEW_KEY, JSON.stringify(v));
    this.viewAs.set(v);
  }

  group(id: () => string) { return computed(() => this.state().groups.find(g => g.id === id())); }

  async say(message: string, color: 'success' | 'danger' | 'medium' = 'medium') {
    (await this.toast.create({ message, color, duration: 2500, position: 'top' })).present();
  }
}
