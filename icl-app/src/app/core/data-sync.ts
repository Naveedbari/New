import { effect, inject, untracked } from '@angular/core';
import { DatabaseService } from './database.service';

/**
 * Re-runs `load` whenever anything is written to the database, so every open screen stays in
 * sync: Ionic keeps tab pages alive in the background and doesn't always tell them they are
 * visible again (e.g. coming back from "Add team" to the Teams tab).
 *
 * Call from a page's constructor. The first load stays with the page's own lifecycle
 * (ionViewWillEnter / constructor); this only handles later changes.
 */
export function reloadOnDataChange(load: () => unknown): void {
  const db = inject(DatabaseService);
  let first = true;
  effect(() => {
    db.changes();
    if (first) {
      first = false;
      return;
    }
    untracked(() => void load());
  });
}
