# Group Ledger

A mobile app (Ionic 8 + Angular 20, standalone components) for managing a group's shared money: advance deposits, expense events, flexible splits, fines, and auditable balances. It was built for indoor cricket teams, but nothing in it is specific to cricket.

```bash
npm install
npm start        # dev server: http://localhost:4200
npm test         # financial core tests (node --test, no browser needed)
npm run build
```

## Architecture

```
src/app/
  core/finance.ts       Financial core: pure TypeScript with no Angular imports. Money engine, ledger commands, queries.
  core/finance.test.ts  15 tests: every worked example from the spec, plus rounding, validation, voids, isolation.
  core/store.ts         Signal store. Applies a pure command, persists the result, then publishes it.
  core/ui.ts            Pipes, icons, route-param helper.
  pages/*.page.ts       One standalone page per screen, lazy-loaded.
```

**Money is stored as integer paisa** (PKR 1 = 100 paisa), so arithmetic is exact and there is no floating-point drift. Percentages are stored as integer basis points (12.5% = 1250).

**Balances are calculated from the ledger, never stored.** A member's balance is the sum of their transactions' signed `delta` values, so a stored balance can never drift away from its history.

**Every operation is atomic.** Each command is `(state) => newState` and throws an error if the input is invalid. The store writes the whole new state in a single save, and only updates the screen after that save succeeds. A half-applied change can't happen.

**Nothing is deleted.**
- A member who leaves is *deactivated*, and their history stays.
- A wrong deposit or adjustment is corrected by adding a *reversal* transaction.
- An event is *voided*: each of its transactions gets a reversal, and the event record is kept and marked voided.

**Duplicate prevention:**
- The event form generates its id when it opens, and `postEvent` rejects an id it has already seen.
- Save buttons are disabled while a save is running.
- A transaction can be reversed only once.
- Duplicate active member names are rejected.

### Data model

| Entity | Key fields |
|---|---|
| Group | id, name, description, createdAt, settings `{ allowOverdraft, lowBalance }` |
| Member | id, groupId, name, phone, active, joinedAt |
| GroupEvent | id, groupId, title, category, date, total, lines[] (base, extra, total, rule per member), status `posted\|voided`, createdBy, createdAt |
| Tx | id, groupId, memberId, eventId?, type, delta (signed), date, description, method?, createdBy, createdAt, reversesId? |

Transaction types: `deposit`, `expense`, `charge` (fine or additional charge), `refund`, `credit_adj`, `debit_adj`, `reversal`.

### Distribution engine (`distribute(total, participants)`)

Each participant uses one of three rules:
- `equal`: splits whatever remains.
- `percent`: a percentage of the event total.
- `fixed`: a set amount.

Any mix of the three is allowed. The engine:
1. Applies the fixed shares first.
2. Computes the percentage shares exactly against the total.
3. Splits the remainder evenly across the `equal` participants.
4. Hands any leftover paisa from rounding to participants one paisa at a time, so the shares always add up to the total exactly. This is asserted on every call.

Validation:
- Percentages above 100% are rejected.
- Fixed amounts above the total are rejected, as is any combination of fixed and percentage shares that exceeds the total.
- If no one is on `equal`, the shares must cover the whole total, or the split is rejected.
- Duplicate participants, an empty participant list, and a zero total are rejected.

**Extras (fines and additional charges)** go *on top* of a member's base share: a fixed amount, or a percentage of their base share, with a reason. Each extra is recorded as its own `charge` transaction.

## Screens

| Screen | Status |
|---|---|
| My Groups (home) | ✅ |
| Group dashboard: Overview, Members, Events, History tabs | ✅ |
| Member details and member dashboard | ✅ |
| Deposit, refund, and manual credit/debit | ✅ |
| Create expense event: details, rate × hours, participants, per-member rules and fines, live preview, shortfall warning, confirm | ✅ |
| Event detail and void | ✅ |
| Reports: date range, daily/weekly/monthly expenses, per member, per event, CSV export (opens in Excel), print-to-PDF | ✅ |
| Group settings and "view as member" preview | ✅ |
| Login / registration, notifications, profile | ⏳ needs a backend (see below) |

## Open questions (business rules I did not invent)

1. **Backend and authentication.** The technology stack was going to be provided separately. For now, data lives in `localStorage` on a single device, and there is one Captain. "View as member" in Settings lets you preview the member experience. Real sign-in, multiple users, and notifications need a backend; candidates are Firebase, Supabase, or a custom API. Replacing `Store.run()` with API calls is the only change the core needs.
2. **Where does fine money go?** Fines are deducted *on top of* the event share and are not used to reduce other members' shares. They count toward the group's funds. Should fines instead reduce what the other participants pay?
3. **What is an "additional percentage" a percentage of?** It is currently a percentage of the member's own base share. Should it be a percentage of the event total?
4. **Outstanding amounts.** An outstanding amount is a negative balance that the Captain explicitly allowed for that event, and this can be turned off per group. The next deposit settles it automatically. Is a separate "settlement" transaction type needed for reporting?
5. **Editing events.** To change an event, you void it and create a corrected one. This keeps the audit trail clean. Is editing in place required?
6. **Currency precision.** Amounts are tracked to the paisa (2 decimals). Should splits round to whole rupees instead?
7. **Refunds.** A refund is currently money credited back to a member's group balance. Is it ever cash paid out of the group, which would need a separate "withdrawal" type?

## Next modules

1. Decide the backend, then build auth, roles, and sync.
2. Notifications.
3. Capacitor Android/iOS builds, with native share for exports.
4. Profile and group images.
