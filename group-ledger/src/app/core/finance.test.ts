// Run: npm test   (node --test, native TS type stripping)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  toPaisa, formatPKR, toBp, distribute, emptyState, createGroup, addMember, updateMember, recordTx,
  postEvent, voidEvent, reverseTx, balances, groupSummary, memberSummaries, type ParticipantInput, type State,
} from './finance.ts';

const eq = (ids: string[]): ParticipantInput[] => ids.map(memberId => ({ memberId, rule: { kind: 'equal' } }));
const ids = (n: number) => Array.from({ length: n }, (_, i) => `m${i}`);
const sumBase = (d: ReturnType<typeof distribute>) => d.lines.reduce((s, l) => s + l.base, 0);

test('money parsing and formatting', () => {
  assert.equal(toPaisa('1,400'), 140000);
  assert.equal(toPaisa('10.5'), 1050);
  assert.equal(toPaisa('0.07'), 7);
  assert.throws(() => toPaisa('-5'));
  assert.throws(() => toPaisa('1.234'));
  assert.throws(() => toPaisa('abc'));
  assert.equal(formatPKR(240000), 'PKR 2,400');
  assert.equal(formatPKR(-1050), '-PKR 10.50');
  assert.equal(toBp('12.5'), 1250);
});

test('equal: cricket 1400 x 2h over 7 players = 400 each', () => {
  const d = distribute(toPaisa(1400) * 2, eq(ids(7)));
  assert.deepEqual(d.errors, []);
  assert.ok(d.lines.every(l => l.total === 40000));
});

test('equal: 3000 / 10 = 300', () => {
  assert.ok(distribute(300000, eq(ids(10))).lines.every(l => l.base === 30000));
});

test('equal rounding never creates or loses money: 100 / 3', () => {
  const d = distribute(10000, eq(ids(3)));
  assert.deepEqual(d.lines.map(l => l.base), [3334, 3333, 3333]);
  assert.equal(sumBase(d), 10000);
});

test('fixed + remainder equal: 3000, A=400, B=400, 8 others = 275', () => {
  const p = eq(ids(10));
  p[0].rule = { kind: 'fixed', amount: 40000 };
  p[1].rule = { kind: 'fixed', amount: 40000 };
  const d = distribute(300000, p);
  assert.deepEqual(d.errors, []);
  assert.deepEqual(d.lines.slice(2).map(l => l.base), Array(8).fill(27500));
  assert.equal(sumBase(d), 300000);
});

test('percent + remainder equal: 10000 with 20/15/10% and 5 equal on 55%', () => {
  const p = eq(ids(8));
  p[0].rule = { kind: 'percent', bp: 2000 };
  p[1].rule = { kind: 'percent', bp: 1500 };
  p[2].rule = { kind: 'percent', bp: 1000 };
  const d = distribute(1000000, p);
  assert.deepEqual(d.lines.map(l => l.base), [200000, 150000, 100000, 110000, 110000, 110000, 110000, 110000]);
});

test('percent only must total 100%, leftover paisa by largest remainder', () => {
  const bad = distribute(10000, [{ memberId: 'a', rule: { kind: 'percent', bp: 5000 } }, { memberId: 'b', rule: { kind: 'percent', bp: 4000 } }]);
  assert.equal(bad.errors.length, 1);
  const d = distribute(100, ['a', 'b', 'c'].map(memberId => ({ memberId, rule: { kind: 'percent' as const, bp: 3333 } })).concat([{ memberId: 'd', rule: { kind: 'percent', bp: 1 } }]));
  assert.deepEqual(d.errors, []);
  assert.equal(sumBase(d), 100);
});

test('validation: over 100%, fixed exceeding total, duplicates, empty, zero total', () => {
  assert.ok(distribute(1000, [{ memberId: 'a', rule: { kind: 'percent', bp: 6000 } }, { memberId: 'b', rule: { kind: 'percent', bp: 6000 } }]).errors.length);
  assert.ok(distribute(1000, [{ memberId: 'a', rule: { kind: 'fixed', amount: 1001 } }, ...eq(['b'])]).errors.length);
  assert.ok(distribute(1000, [{ memberId: 'a', rule: { kind: 'fixed', amount: 600 } }, { memberId: 'b', rule: { kind: 'percent', bp: 5000 } }, ...eq(['c'])]).errors.length);
  assert.ok(distribute(1000, eq(['a', 'a'])).errors.length);
  assert.ok(distribute(1000, []).errors.length);
  assert.ok(distribute(0, eq(['a'])).errors.length);
  assert.ok(distribute(1000, [{ memberId: 'a', rule: { kind: 'fixed', amount: 400 } }]).errors.length); // 600 unassigned
});

test('mixed with fines: extras on top of share, base still reconciles', () => {
  const p: ParticipantInput[] = [
    { memberId: 'a', rule: { kind: 'fixed', amount: 40000 }, extraBp: 1000, extraReason: 'Late' },
    { memberId: 'b', rule: { kind: 'equal' }, extraFixed: 10000, extraReason: 'Fine' },
    { memberId: 'c', rule: { kind: 'equal' } },
  ];
  const d = distribute(100000, p);
  assert.deepEqual(d.lines.map(l => [l.base, l.extra, l.total]), [[40000, 4000, 44000], [30000, 10000, 40000], [30000, 0, 30000]]);
  assert.equal(sumBase(d), 100000);
});

// ---------- ledger ----------
function team(n = 12): { s: State; g: string; m: string[] } {
  let [s, g] = createGroup(emptyState(), 'Indoor Cricket');
  const m: string[] = [];
  for (let i = 0; i < n; i++) {
    let mem; [s, mem] = addMember(s, g.id, `Player ${i}`);
    m.push(mem.id);
    s = recordTx(s, 'deposit', { groupId: g.id, memberId: mem.id, amount: 200000, date: '2026-11-01', by: 'captain' });
  }
  return { s, g: g.id, m };
}

test('12 deposits of 2000 = 24000; 7 of 12 play; non-participants untouched', () => {
  const { s, g, m } = team();
  assert.equal(groupSummary(s, g).deposits, 2400000);
  const s2 = postEvent(s, { id: 'e1', groupId: g, title: 'Weekend Cricket', category: 'Indoor Cricket', date: '2026-11-15', total: 280000, participants: eq(m.slice(0, 7)), allowOutstanding: false, by: 'captain' });
  const b = balances(s2, g);
  m.slice(0, 7).forEach(id => assert.equal(b.get(id), 160000));
  m.slice(7).forEach(id => assert.equal(b.get(id), 200000));
  const sum = groupSummary(s2, g);
  assert.equal(sum.expenses, 280000);
  assert.equal(sum.net, 2400000 - 280000);
  assert.throws(() => postEvent(s2, { id: 'e1', groupId: g, title: 'x', category: 'Other', date: '2026-11-15', total: 100, participants: eq([m[0]]), allowOutstanding: false, by: 'c' }), /already saved/);
});

test('Player A: 2000 - 400 - 300 - fine 100 = 1200', () => {
  const { s, g, m } = team(1);
  let s2 = postEvent(s, { id: 'e1', groupId: g, title: 'Cricket', category: 'Indoor Cricket', date: '2026-11-02', total: 40000, participants: eq(m), allowOutstanding: false, by: 'c' });
  s2 = postEvent(s2, { id: 'e2', groupId: g, title: 'Dinner', category: 'Dinner', date: '2026-11-03', total: 30000, participants: [{ memberId: m[0], rule: { kind: 'equal' }, extraFixed: 10000, extraReason: 'Late' }], allowOutstanding: false, by: 'c' });
  assert.equal(balances(s2, g).get(m[0]), 120000);
  const ms = memberSummaries(s2, g)[0];
  assert.equal(ms.charges, 10000);
  assert.equal(ms.events, 2);
});

test('insufficient balance blocked unless outstanding is authorised', () => {
  const { s, g, m } = team(2);
  const e = { id: 'big', groupId: g, title: 'Trip', category: 'Trip / Vacation', date: '2026-11-04', total: 500000, participants: eq(m), by: 'c' };
  assert.throws(() => postEvent(s, { ...e, allowOutstanding: false }), /Insufficient/);
  const s2 = postEvent(s, { ...e, allowOutstanding: true });
  const sum = groupSummary(s2, g);
  assert.equal(sum.outstanding, 100000);
  assert.equal(sum.available, 0);
  // a later deposit settles the outstanding
  const s3 = recordTx(s2, 'deposit', { groupId: g, memberId: m[0], amount: 60000, date: '2026-11-05', by: 'c' });
  assert.equal(memberSummaries(s3, g)[0].outstanding, 0);
  assert.equal(memberSummaries(s3, g)[0].balance, 10000);
});

test('void event restores balances via reversals, history kept, no double void', () => {
  const { s, g, m } = team(3);
  const s2 = postEvent(s, { id: 'e', groupId: g, title: 'Dinner', category: 'Dinner', date: '2026-11-04', total: 90000, participants: [{ memberId: m[0], rule: { kind: 'equal' }, extraFixed: 500 }, ...eq(m.slice(1))], allowOutstanding: false, by: 'c' });
  const s3 = voidEvent(s2, 'e', 'wrong amount', 'c');
  m.forEach(id => assert.equal(balances(s3, g).get(id), 200000));
  assert.equal(s3.txs.length, s2.txs.length + 4);
  assert.equal(groupSummary(s3, g).expenses, 0);
  assert.throws(() => voidEvent(s3, 'e', 'again', 'c'));
});

test('reverse deposit once; reversal of reversal and event tx blocked', () => {
  const { s, g, m } = team(1);
  const dep = s.txs[0];
  const s2 = reverseTx(s, dep.id, 'typo', 'c');
  assert.equal(balances(s2, g).get(m[0]), 0);
  assert.equal(groupSummary(s2, g).deposits, 0);
  assert.throws(() => reverseTx(s2, dep.id, 'again', 'c'), /already/);
  assert.throws(() => reverseTx(s2, s2.txs.at(-1)!.id, 'x', 'c'));
  const s3 = postEvent(s, { id: 'e', groupId: g, title: 'x', category: 'Other', date: '2026-11-01', total: 100, participants: eq(m), allowOutstanding: false, by: 'c' });
  assert.throws(() => reverseTx(s3, s3.txs.at(-1)!.id, 'x', 'c'), /voiding/);
});

test('group isolation and inactive members', () => {
  const a = team(1);
  let [s, g2] = createGroup(a.s, 'Trip');
  let x; [s, x] = addMember(s, g2.id, 'Player 0');
  s = recordTx(s, 'deposit', { groupId: g2.id, memberId: x.id, amount: 5000, date: '2026-11-01', by: 'c' });
  assert.equal(balances(s, a.g).get(a.m[0]), 200000);
  assert.equal(groupSummary(s, g2.id).deposits, 5000);
  assert.throws(() => recordTx(s, 'deposit', { groupId: g2.id, memberId: a.m[0], amount: 1, date: '', by: 'c' }), /not found/);
  s = updateMember(s, x.id, { active: false });
  assert.throws(() => recordTx(s, 'deposit', { groupId: g2.id, memberId: x.id, amount: 1, date: '', by: 'c' }), /inactive/);
  assert.equal(memberSummaries(s, g2.id)[0].deposits, 5000); // history kept
  assert.throws(() => recordTx(s, 'debit_adj', { groupId: a.g, memberId: a.m[0], amount: 1, date: '', by: 'c' }), /reason/);
});
