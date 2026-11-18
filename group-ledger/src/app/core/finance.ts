// Financial core: pure functions, no Angular imports, so it runs under `node --test`.
// All money is integer paisa (1 PKR = 100 paisa) -> exact arithmetic, no float drift.
// State is never mutated: every command returns a new state or throws, which makes
// each operation atomic (the store persists the whole new state in one write).

export type Paisa = number;

// ---------- money ----------
export function toPaisa(input: string | number): Paisa {
  const s = String(input).replace(/,/g, '').trim();
  if (!/^\d+(\.\d{0,2})?$/.test(s)) throw new Error(`Invalid amount: "${input}"`);
  const [whole, frac = ''] = s.split('.');
  return Number(whole) * 100 + Number(frac.padEnd(2, '0'));
}

export function formatPKR(p: Paisa): string {
  const sign = p < 0 ? '-' : '';
  const abs = Math.abs(p);
  const rupees = Math.floor(abs / 100).toLocaleString('en-US');
  const paisa = abs % 100;
  return `${sign}PKR ${rupees}${paisa ? '.' + String(paisa).padStart(2, '0') : ''}`;
}

/** Percent with up to 2 decimals -> basis points (integer). 12.5% -> 1250. */
export function toBp(percent: number | string): number {
  const s = String(percent).trim();
  if (!/^\d+(\.\d{0,2})?$/.test(s)) throw new Error(`Invalid percentage: "${percent}"`);
  return Math.round(Number(s) * 100);
}

// ---------- distribution engine ----------
export type ShareRule = { kind: 'equal' } | { kind: 'percent'; bp: number } | { kind: 'fixed'; amount: Paisa };

export interface ParticipantInput {
  memberId: string;
  rule: ShareRule;
  extraFixed?: Paisa;   // additional charge / fine, on top of the share
  extraBp?: number;     // additional % of the member's base share
  extraReason?: string;
}

export interface ShareLine {
  memberId: string;
  rule: ShareRule;
  base: Paisa;
  extra: Paisa;
  extraReason?: string;
  total: Paisa;
}

export interface Distribution { lines: ShareLine[]; errors: string[] }

export function distribute(total: Paisa, parts: ParticipantInput[]): Distribution {
  const errors: string[] = [];
  if (!Number.isInteger(total) || total <= 0) errors.push('Total expense must be greater than zero.');
  if (!parts.length) errors.push('Select at least one participant.');
  if (new Set(parts.map(p => p.memberId)).size !== parts.length) errors.push('A participant is selected twice.');
  for (const p of parts) {
    if (p.rule.kind === 'fixed' && (!Number.isInteger(p.rule.amount) || p.rule.amount < 0)) errors.push('Fixed amounts must be zero or more.');
    if (p.rule.kind === 'percent' && (!Number.isInteger(p.rule.bp) || p.rule.bp < 0 || p.rule.bp > 10000)) errors.push('Percentages must be between 0 and 100.');
    if ((p.extraFixed ?? 0) < 0 || (p.extraBp ?? 0) < 0) errors.push('Additional charges cannot be negative.');
  }
  if (errors.length) return { lines: [], errors };

  const fixedSum = parts.reduce((s, p) => s + (p.rule.kind === 'fixed' ? p.rule.amount : 0), 0);
  const pctBp = parts.reduce((s, p) => s + (p.rule.kind === 'percent' ? p.rule.bp : 0), 0);
  const equal = parts.filter(p => p.rule.kind === 'equal');
  const pct = parts.filter(p => p.rule.kind === 'percent');

  if (pctBp > 10000) errors.push(`Percentages add up to ${pctBp / 100}%, more than 100%.`);
  if (fixedSum > total) errors.push(`Fixed amounts (${formatPKR(fixedSum)}) exceed the total expense (${formatPKR(total)}).`);
  // exact remainder for "equal" members, scaled by 10000: (total - fixed) - total*pct/100
  const remainderScaled = (total - fixedSum) * 10000 - total * pctBp;
  if (!errors.length && remainderScaled < 0) errors.push('Fixed amounts plus percentages exceed the total expense.');
  if (!errors.length && !equal.length && remainderScaled !== 0) {
    errors.push(`Allocations don't cover the total: ${formatPKR(Math.round(remainderScaled / 10000))} left unassigned. Add an "equal" participant or adjust shares.`);
  }
  if (errors.length) return { lines: [], errors };

  const base = new Map<string, Paisa>();
  for (const p of parts) if (p.rule.kind === 'fixed') base.set(p.memberId, p.rule.amount);

  // Percent shares: floor, then hand leftover paisa by largest remainder (only when
  // no equal participants absorb them).
  const frac: { id: string; r: number }[] = [];
  for (const p of pct) {
    const exact = total * (p.rule as { bp: number }).bp;
    base.set(p.memberId, Math.floor(exact / 10000));
    frac.push({ id: p.memberId, r: exact % 10000 });
  }
  let left = total - [...base.values()].reduce((a, b) => a + b, 0);
  if (equal.length) {
    const each = Math.floor(left / equal.length);
    let extraPaisa = left - each * equal.length;
    for (const p of equal) base.set(p.memberId, each + (extraPaisa-- > 0 ? 1 : 0));
  } else {
    frac.sort((a, b) => b.r - a.r);
    for (let i = 0; left > 0; i++, left--) base.set(frac[i].id, base.get(frac[i].id)! + 1);
  }

  const lines = parts.map(p => {
    const b = base.get(p.memberId)!;
    const extra = (p.extraFixed ?? 0) + Math.round((b * (p.extraBp ?? 0)) / 10000);
    return { memberId: p.memberId, rule: p.rule, base: b, extra, extraReason: p.extraReason, total: b + extra };
  });
  const check = lines.reduce((s, l) => s + l.base, 0);
  if (check !== total) throw new Error(`Engine invariant broken: ${check} != ${total}`); // never expected
  return { lines, errors: [] };
}

// ---------- data model ----------
export const CATEGORIES = ['Indoor Cricket', 'Outdoor Sports', 'Dinner', 'Trip / Vacation', 'Outing', 'General Expense', 'Other'] as const;

export type TxType = 'deposit' | 'expense' | 'charge' | 'refund' | 'credit_adj' | 'debit_adj' | 'reversal';
export const TX_LABEL: Record<TxType, string> = {
  deposit: 'Advance deposit', expense: 'Expense share', charge: 'Additional charge / fine', refund: 'Refund',
  credit_adj: 'Manual credit', debit_adj: 'Manual debit', reversal: 'Reversal',
};
const TX_SIGN: Record<Exclude<TxType, 'reversal'>, 1 | -1> = {
  deposit: 1, refund: 1, credit_adj: 1, expense: -1, charge: -1, debit_adj: -1,
};

export interface Group { id: string; name: string; description: string; createdAt: string; settings: { allowOverdraft: boolean; lowBalance: Paisa } }
export interface Member { id: string; groupId: string; name: string; phone: string; active: boolean; joinedAt: string }
export interface Tx {
  id: string; groupId: string; memberId: string; eventId?: string;
  type: TxType; delta: Paisa;            // signed effect on the member's balance
  date: string; description: string; method?: string;
  createdBy: string; createdAt: string;
  reversesId?: string;                   // set on reversal txs
}
export interface GroupEvent {
  id: string; groupId: string; title: string; category: string; date: string; description: string;
  total: Paisa; lines: ShareLine[]; status: 'posted' | 'voided'; createdBy: string; createdAt: string;
}
export interface State { groups: Group[]; members: Member[]; events: GroupEvent[]; txs: Tx[] }
export const emptyState = (): State => ({ groups: [], members: [], events: [], txs: [] });

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
function need<T>(v: T | undefined, msg: string): T { if (!v) throw new Error(msg); return v; }
function nonEmpty(s: string, what: string) { if (!s?.trim()) throw new Error(`${what} is required.`); return s.trim(); }

// ---------- commands (state -> new state, throw on invalid) ----------
export function createGroup(s: State, name: string, description = ''): [State, Group] {
  const g: Group = { id: uid(), name: nonEmpty(name, 'Group name'), description: description.trim(), createdAt: now(), settings: { allowOverdraft: true, lowBalance: 50000 } };
  return [{ ...s, groups: [...s.groups, g] }, g];
}

export function updateGroup(s: State, id: string, patch: Partial<Pick<Group, 'name' | 'description' | 'settings'>>): State {
  need(s.groups.find(g => g.id === id), 'Group not found.');
  if (patch.name !== undefined) nonEmpty(patch.name, 'Group name');
  return { ...s, groups: s.groups.map(g => (g.id === id ? { ...g, ...patch } : g)) };
}

export function addMember(s: State, groupId: string, name: string, phone = ''): [State, Member] {
  need(s.groups.find(g => g.id === groupId), 'Group not found.');
  const n = nonEmpty(name, 'Member name');
  if (s.members.some(m => m.groupId === groupId && m.active && m.name.toLowerCase() === n.toLowerCase())) throw new Error(`"${n}" is already a member.`);
  const m: Member = { id: uid(), groupId, name: n, phone: phone.trim(), active: true, joinedAt: now() };
  return [{ ...s, members: [...s.members, m] }, m];
}

/** Members are deactivated, never deleted, so history stays intact. */
export function updateMember(s: State, id: string, patch: Partial<Pick<Member, 'name' | 'phone' | 'active'>>): State {
  need(s.members.find(m => m.id === id), 'Member not found.');
  if (patch.name !== undefined) nonEmpty(patch.name, 'Member name');
  return { ...s, members: s.members.map(m => (m.id === id ? { ...m, ...patch } : m)) };
}

export interface MoneyInput { groupId: string; memberId: string; amount: Paisa; date: string; description?: string; method?: string; by: string }

/** Deposits, refunds and manual adjustments. */
export function recordTx(s: State, type: Exclude<TxType, 'reversal' | 'expense' | 'charge'>, i: MoneyInput): State {
  const m = need(s.members.find(x => x.id === i.memberId && x.groupId === i.groupId), 'Member not found in this group.');
  if (!m.active) throw new Error(`${m.name} is inactive.`);
  if (!Number.isInteger(i.amount) || i.amount <= 0) throw new Error('Amount must be greater than zero.');
  if (type !== 'deposit' && type !== 'refund' && !i.description?.trim()) throw new Error('A reason is required for manual adjustments.');
  const tx: Tx = {
    id: uid(), groupId: i.groupId, memberId: i.memberId, type, delta: TX_SIGN[type] * i.amount,
    date: i.date, description: i.description?.trim() || TX_LABEL[type], method: i.method, createdBy: i.by, createdAt: now(),
  };
  return { ...s, txs: [...s.txs, tx] };
}

export interface EventInput {
  id: string;            // generated when the form opens -> idempotency key against double submit
  groupId: string; title: string; category: string; date: string; description?: string;
  total: Paisa; participants: ParticipantInput[]; allowOutstanding: boolean; by: string;
}

/** Members whose balance would drop below zero by posting these lines. */
export function shortfalls(s: State, groupId: string, lines: ShareLine[]) {
  const bal = balances(s, groupId);
  return lines
    .map(l => ({ memberId: l.memberId, available: bal.get(l.memberId) ?? 0, required: l.total }))
    .filter(x => x.required > 0 && x.available - x.required < 0);
}

export function postEvent(s: State, e: EventInput): State {
  if (s.events.some(x => x.id === e.id)) throw new Error('This event was already saved.');
  const g = need(s.groups.find(x => x.id === e.groupId), 'Group not found.');
  for (const p of e.participants) {
    const m = need(s.members.find(x => x.id === p.memberId && x.groupId === g.id), 'Participant is not in this group.');
    if (!m.active) throw new Error(`${m.name} is inactive.`);
  }
  const d = distribute(e.total, e.participants);
  if (d.errors.length) throw new Error(d.errors.join(' '));
  const short = shortfalls(s, g.id, d.lines);
  if (short.length && !(e.allowOutstanding && g.settings.allowOverdraft)) {
    throw new Error(`Insufficient balance for ${short.length} participant(s). Confirm recording the shortfall as outstanding.`);
  }
  const ev: GroupEvent = {
    id: e.id, groupId: g.id, title: nonEmpty(e.title, 'Event title'), category: e.category, date: e.date,
    description: e.description?.trim() ?? '', total: e.total, lines: d.lines, status: 'posted', createdBy: e.by, createdAt: now(),
  };
  const txs: Tx[] = [];
  for (const l of d.lines) {
    const common = { groupId: g.id, memberId: l.memberId, eventId: ev.id, date: e.date, createdBy: e.by, createdAt: ev.createdAt };
    if (l.base > 0) txs.push({ ...common, id: uid(), type: 'expense', delta: -l.base, description: ev.title });
    if (l.extra > 0) txs.push({ ...common, id: uid(), type: 'charge', delta: -l.extra, description: `${ev.title}: ${l.extraReason?.trim() || 'Additional charge'}` });
  }
  return { ...s, events: [...s.events, ev], txs: [...s.txs, ...txs] };
}

const reversedIds = (s: State) => new Set(s.txs.filter(t => t.reversesId).map(t => t.reversesId!));

export function reverseTx(s: State, txId: string, reason: string, by: string): State {
  const t = need(s.txs.find(x => x.id === txId), 'Transaction not found.');
  if (t.type === 'reversal') throw new Error('A reversal cannot be reversed. Record a new transaction instead.');
  if (reversedIds(s).has(t.id)) throw new Error('This transaction was already reversed.');
  if (t.eventId && s.events.find(e => e.id === t.eventId)?.status === 'posted') throw new Error('Event transactions are corrected by voiding the event.');
  const r: Tx = {
    id: uid(), groupId: t.groupId, memberId: t.memberId, eventId: t.eventId, type: 'reversal', delta: -t.delta,
    date: now().slice(0, 10), description: `Reversal: ${nonEmpty(reason, 'Reason')}`, createdBy: by, createdAt: now(), reversesId: t.id,
  };
  return { ...s, txs: [...s.txs, r] };
}

/** Void = reverse every transaction of the event. Nothing is deleted. */
export function voidEvent(s: State, eventId: string, reason: string, by: string): State {
  const ev = need(s.events.find(e => e.id === eventId), 'Event not found.');
  if (ev.status === 'voided') throw new Error('Event is already voided.');
  nonEmpty(reason, 'Reason');
  let next: State = { ...s, events: s.events.map(e => (e.id === eventId ? { ...e, status: 'voided' as const } : e)) };
  for (const t of s.txs.filter(t => t.eventId === eventId && t.type !== 'reversal')) next = reverseTx(next, t.id, `${ev.title} voided — ${reason}`, by);
  return next;
}

// ---------- queries ----------
export function balances(s: State, groupId: string): Map<string, Paisa> {
  const m = new Map<string, Paisa>();
  for (const t of s.txs) if (t.groupId === groupId) m.set(t.memberId, (m.get(t.memberId) ?? 0) + t.delta);
  return m;
}

export interface Totals { deposits: Paisa; expenses: Paisa; charges: Paisa; refunds: Paisa; credits: Paisa; debits: Paisa }

/** Category totals over effective txs (reversed pairs cancel out and are excluded). */
export function totals(txs: Tx[], allTxs: Tx[] = txs): Totals {
  const rev = new Set(allTxs.filter(t => t.reversesId).map(t => t.reversesId!));
  const r: Totals = { deposits: 0, expenses: 0, charges: 0, refunds: 0, credits: 0, debits: 0 };
  const key: Record<Exclude<TxType, 'reversal'>, keyof Totals> = { deposit: 'deposits', expense: 'expenses', charge: 'charges', refund: 'refunds', credit_adj: 'credits', debit_adj: 'debits' };
  for (const t of txs) if (t.type !== 'reversal' && !rev.has(t.id)) r[key[t.type]] += Math.abs(t.delta);
  return r;
}

export interface MemberSummary extends Totals { member: Member; balance: Paisa; outstanding: Paisa; events: number }

export function memberSummaries(s: State, groupId: string): MemberSummary[] {
  const bal = balances(s, groupId);
  const gtx = s.txs.filter(t => t.groupId === groupId);
  return s.members.filter(m => m.groupId === groupId).map(m => {
    const b = bal.get(m.id) ?? 0;
    const mine = gtx.filter(t => t.memberId === m.id);
    const events = s.events.filter(e => e.status === 'posted' && e.groupId === groupId && e.lines.some(l => l.memberId === m.id)).length;
    return { member: m, balance: b, outstanding: Math.max(0, -b), events, ...totals(mine, gtx) };
  });
}

export function groupSummary(s: State, groupId: string) {
  const ms = memberSummaries(s, groupId);
  const gtx = s.txs.filter(t => t.groupId === groupId);
  const t = totals(gtx);
  const net = ms.reduce((a, m) => a + m.balance, 0);
  return {
    ...t,
    members: ms.filter(m => m.member.active).length,
    available: ms.reduce((a, m) => a + Math.max(0, m.balance), 0),
    outstanding: ms.reduce((a, m) => a + m.outstanding, 0),
    net, // = deposits + refunds + credits - expenses - charges - debits (reconciles)
  };
}
