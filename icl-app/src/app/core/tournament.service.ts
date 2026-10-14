import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  CoinSide,
  Match,
  KnockoutFormat,
  MatchScore,
  MatchWinner,
  Pool,
  PoolFixtures,
  PoolTeam,
  Team,
  Toss,
  TossDecision,
  Tournament,
  TournamentStatus,
} from './models';

interface TournamentRow {
  id: number;
  name: string;
  season: number | null;
  played_on: string;
  status: TournamentStatus;
  champion_team_id: number | null;
  champion_team_name: string | null;
  mvp_name: string | null;
  court_count: number | null;
  match_minutes: number | null;
  overs: number | null;
  qualify_count: number | null;
  ko_format: KnockoutFormat | null;
  logo: string | null;
  current_team_name: string | null;
}

interface PoolTeamRow {
  pool_id: number;
  pool_name: string;
  court: number | null;
  start_time: string | null;
  booking_minutes: number | null;
  team_id: number | null;
  team_name: string;
  current_team_name: string | null;
  logo: string | null;
}

const SELECT = `
  SELECT t.*, tm.logo AS logo, tm.name AS current_team_name
  FROM tournaments t
  LEFT JOIN teams tm ON tm.id = t.champion_team_id`;

const toTournament = (r: TournamentRow): Tournament => ({
  id: r.id,
  name: r.name,
  season: r.season,
  playedOn: r.played_on,
  status: r.status,
  championTeamId: r.champion_team_id,
  championTeamName: r.current_team_name ?? r.champion_team_name,
  championLogo: r.logo,
  mvpName: r.mvp_name,
  courtCount: r.court_count,
  matchMinutes: r.match_minutes,
  overs: r.overs,
  qualifyCount: r.qualify_count,
  koFormat: r.ko_format,
});

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const letter = (index: number): string =>
  index < 26 ? String.fromCharCode(65 + index) : String(index + 1);

export function poolName(index: number): string {
  return `Pool ${letter(index)}`;
}

/** Courts are stored as 1-based numbers and shown as letters: 1 → "Court A". */
export function courtName(court: number): string {
  return `Court ${letter(court - 1)}`;
}

export function seasonName(season: number): string {
  return `ICL Season ${season}`;
}

/**
 * Pool sizes for splitting `teamCount` teams as evenly as possible,
 * e.g. 8 teams / 2 pools → [4, 4]; 10 teams / 3 pools → [4, 3, 3].
 */
export function poolSizes(teamCount: number, poolCount: number): number[] {
  const base = Math.floor(teamCount / poolCount);
  const extra = teamCount % poolCount;
  return Array.from({ length: poolCount }, (_, i) => base + (i < extra ? 1 : 0));
}

/**
 * Court for each pool. Courts are taken in a random order and handed out
 * left to right, cycling when there are more pools than courts — so with
 * 4 pools and 2 courts, two pools share each court.
 */
export function assignCourts(poolCount: number, courtCount: number): number[] {
  const order = shuffle(Array.from({ length: courtCount }, (_, i) => i + 1));
  return Array.from({ length: poolCount }, (_, i) => order[i % courtCount]!);
}

/**
 * Round-robin fixtures for one pool: every team plays every other team once
 * (3 teams → 3 matches, 4 teams → 6). Order is random, then rearranged so a
 * team avoids playing two matches in a row where possible.
 */
export function roundRobin(teams: PoolTeam[]): Omit<Match, 'position'>[] {
  const pairs: [PoolTeam, PoolTeam][] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push(Math.random() < 0.5 ? [teams[i]!, teams[j]!] : [teams[j]!, teams[i]!]);
    }
  }
  const remaining = shuffle(pairs);
  const ordered: [PoolTeam, PoolTeam][] = [];
  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    const busy = new Set(last ? [last[0].name, last[1].name] : []);
    const idx = remaining.findIndex(([a, b]) => !busy.has(a.name) && !busy.has(b.name));
    ordered.push(remaining.splice(idx === -1 ? 0 : idx, 1)[0]!);
  }
  return ordered.map(([team1, team2]) => ({ team1, team2, winner: null, toss: null, score: null }));
}

/** Randomly splits all `teams` into `poolCount` balanced pools and gives each a court. */
export function drawPools(teams: Team[], poolCount: number, courtCount: number): Pool[] {
  const shuffled = shuffle(teams);
  const courts = assignCourts(poolCount, courtCount);
  let offset = 0;
  return poolSizes(teams.length, poolCount).map((size, i) => {
    const members = shuffled.slice(offset, offset + size);
    offset += size;
    return {
      name: poolName(i),
      court: courts[i]!,
      startTime: null,
      bookingMinutes: null,
      teams: members.map((t) => ({ teamId: t.id ?? null, name: t.name, logo: t.logo })),
    };
  });
}

interface MatchRow {
  id: number;
  pool_id: number;
  position: number;
  team1_id: number | null;
  team1_name: string;
  team2_id: number | null;
  team2_name: string;
  winner: MatchWinner;
  toss_caller: 1 | 2 | null;
  toss_call: CoinSide | null;
  toss_result: CoinSide | null;
  toss_winner: 1 | 2 | null;
  toss_decision: TossDecision | null;
  bat_first: 1 | 2 | null;
  inn1_runs: number | null;
  inn1_balls: number | null;
  inn2_runs: number | null;
  inn2_balls: number | null;
  ko_round: number | null;
  t1_name: string | null;
  t1_logo: string | null;
  t2_name: string | null;
  t2_logo: string | null;
}

function toMatch(r: MatchRow): Match {
  return {
    id: r.id,
    poolId: r.pool_id,
    position: r.position,
    team1: { teamId: r.team1_id, name: r.t1_name ?? r.team1_name, logo: r.t1_logo },
    team2: { teamId: r.team2_id, name: r.t2_name ?? r.team2_name, logo: r.t2_logo },
    winner: r.winner,
    toss:
      r.toss_caller && r.toss_call && r.toss_result && r.toss_winner
        ? { caller: r.toss_caller, call: r.toss_call, result: r.toss_result, winner: r.toss_winner, decision: r.toss_decision }
        : null,
    score:
      r.bat_first && r.inn1_runs != null && r.inn1_balls && r.inn2_runs != null && r.inn2_balls
        ? { batFirst: r.bat_first, inn1Runs: r.inn1_runs, inn1Balls: r.inn1_balls, inn2Runs: r.inn2_runs, inn2Balls: r.inn2_balls }
        : null,
    koRound: r.ko_round,
    isBye: r.ko_round != null && r.team2_id == null && !r.team2_name,
  };
}

/**
 * Seed order for a bracket of `size` slots, e.g. 4 → [1, 4, 2, 3], 8 → [1, 8, 4, 5, 2, 7, 3, 6].
 * Adjacent pairs play each other, and seeds 1 and 2 can only meet in the final.
 */
export function bracketOrder(size: number): number[] {
  let order = [1, 2];
  while (order.length < size) {
    const n = order.length * 2 + 1;
    order = order.flatMap((s) => [s, n - s]);
  }
  return order;
}

/** Label of one knockout match, e.g. "Qualifier 1" in playoffs or "Semi-final" in a bracket. */
export function koMatchLabel(format: KnockoutFormat | null | undefined, m: Match, roundSize: number): string {
  if (format === 'playoff') {
    if (m.koRound === 1) return m.position === 0 ? 'Qualifier 1' : 'Eliminator';
    return m.koRound === 2 ? 'Qualifier 2' : 'Final';
  }
  return roundSize === 1 ? 'Final' : roundSize === 2 ? 'Semi-final' : roundSize === 4 ? 'Quarter-final' : `Round of ${roundSize * 2}`;
}

/** Heading for a knockout round in list views. */
export function koRoundTitle(format: KnockoutFormat | null | undefined, round: number, roundSize: number): string {
  if (format === 'playoff') return round === 1 ? 'Qualifier 1 & Eliminator' : round === 2 ? 'Qualifier 2' : 'Final';
  return knockoutRoundName(roundSize);
}

/** "Final", "Semi-finals", "Quarter-finals", else "Round of N". */
export function knockoutRoundName(matchCount: number): string {
  if (matchCount === 1) return 'Final';
  if (matchCount === 2) return 'Semi-finals';
  if (matchCount === 4) return 'Quarter-finals';
  return `Round of ${matchCount * 2}`;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private readonly db = inject(DatabaseService);

  async list(status?: TournamentStatus): Promise<Tournament[]> {
    const where = status ? 'WHERE t.status = ?' : '';
    const rows = await this.db.query<TournamentRow>(
      `${SELECT} ${where} ORDER BY t.played_on DESC, t.id DESC`,
      status ? [status] : [],
    );
    return rows.map(toTournament);
  }

  /** Season number for the next tournament: one after the highest season so far. */
  async nextSeason(): Promise<number> {
    const rows = await this.db.query<{ last: number | null }>('SELECT MAX(season) AS last FROM tournaments');
    return (rows[0]?.last ?? 0) + 1;
  }

  async seasonExists(season: number): Promise<boolean> {
    const rows = await this.db.query('SELECT id FROM tournaments WHERE season = ? LIMIT 1', [season]);
    return rows.length > 0;
  }

  /** The most recently played tournament that has a champion. */
  async latestChampion(): Promise<Tournament | null> {
    return (await this.list('completed'))[0] ?? null;
  }

  async get(id: number): Promise<Tournament | null> {
    const rows = await this.db.query<TournamentRow>(`${SELECT} WHERE t.id = ?`, [id]);
    if (!rows[0]) return null;
    const tournament = toTournament(rows[0]);
    tournament.pools = await this.pools(id);
    return tournament;
  }

  private async pools(tournamentId: number): Promise<Pool[]> {
    const rows = await this.db.query<PoolTeamRow>(
      `SELECT p.id AS pool_id, p.name AS pool_name, p.court, p.start_time, p.booking_minutes, pt.team_id, pt.team_name,
              tm.name AS current_team_name, tm.logo
       FROM tournament_pools p
       LEFT JOIN pool_teams pt ON pt.pool_id = p.id
       LEFT JOIN teams tm ON tm.id = pt.team_id
       WHERE p.tournament_id = ?
       ORDER BY p.position, pt.position`,
      [tournamentId],
    );
    const pools = new Map<number, Pool>();
    for (const r of rows) {
      let pool = pools.get(r.pool_id);
      if (!pool) {
        pool = {
          id: r.pool_id,
          name: r.pool_name,
          court: r.court,
          startTime: r.start_time,
          bookingMinutes: r.booking_minutes,
          teams: [],
        };
        pools.set(r.pool_id, pool);
      }
      if (r.team_name !== null) {
        pool.teams.push({ teamId: r.team_id, name: r.current_team_name ?? r.team_name, logo: r.logo });
      }
    }
    return [...pools.values()];
  }

  /** Creates an ongoing tournament together with its drawn pools. Returns the new id. */
  async start(
    season: number,
    playedOn: string,
    courtCount: number,
    pools: Pool[],
    format: { matchMinutes: number; overs: number; qualifyCount: number },
  ): Promise<number> {
    return this.db.transaction(async (run) => {
      const id = (await run(
        `INSERT INTO tournaments (name, season, played_on, status, court_count, match_minutes, overs, qualify_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [seasonName(season), season, playedOn, 'ongoing', courtCount, format.matchMinutes, format.overs, format.qualifyCount],
      ))!;
      for (const [pi, pool] of pools.entries()) {
        const poolId = await run(
          `INSERT INTO tournament_pools (tournament_id, name, court, start_time, booking_minutes, position)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, pool.name, pool.court, pool.startTime, pool.bookingMinutes, pi],
        );
        for (const [mi, m] of roundRobin(pool.teams).entries()) {
          await run(
            `INSERT INTO matches (tournament_id, pool_id, position, team1_id, team1_name, team2_id, team2_name)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, poolId, mi, m.team1.teamId, m.team1.name, m.team2.teamId, m.team2.name],
          );
        }
        for (const [ti, team] of pool.teams.entries()) {
          await run('INSERT INTO pool_teams (pool_id, team_id, team_name, position) VALUES (?, ?, ?, ?)', [
            poolId,
            team.teamId,
            team.name,
            ti,
          ]);
        }
      }
      return id;
    });
  }

  /** Saves name/date and the result. Setting a champion marks the tournament completed. */
  async save(t: Tournament): Promise<void> {
    const status: TournamentStatus = t.championTeamId || t.championTeamName ? 'completed' : 'ongoing';
    const values = [t.name.trim(), t.playedOn, status, t.championTeamId, t.championTeamName, t.mvpName?.trim() || null];
    if (t.id) {
      await this.db.run(
        `UPDATE tournaments SET name = ?, played_on = ?, status = ?, champion_team_id = ?,
           champion_team_name = ?, mvp_name = ?
         WHERE id = ?`,
        [...values, t.id],
      );
    } else {
      await this.db.run(
        `INSERT INTO tournaments (name, played_on, status, champion_team_id, champion_team_name, mvp_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        values,
      );
    }
  }

  /** All matches of a tournament grouped by pool, in playing order. */
  /** All matches of a tournament grouped by pool, in playing order. */
  async fixtures(tournamentId: number): Promise<PoolFixtures[]> {
    const pools = await this.pools(tournamentId);
    const rows = await this.matchRows(tournamentId, 'm.ko_round IS NULL');
    return pools.map((pool) => ({
      pool,
      matches: rows.filter((r) => r.pool_id === pool.id).map(toMatch),
    }));
  }

  private matchRows(tournamentId: number, where: string): Promise<MatchRow[]> {
    return this.db.query<MatchRow>(
      `SELECT m.*, a.name AS t1_name, a.logo AS t1_logo, b.name AS t2_name, b.logo AS t2_logo
       FROM matches m
       LEFT JOIN teams a ON a.id = m.team1_id
       LEFT JOIN teams b ON b.id = m.team2_id
       WHERE m.tournament_id = ? AND ${where}
       ORDER BY m.ko_round, m.position`,
      [tournamentId],
    );
  }

  // ---------- Knockout (Round 2) ----------

  /** Knockout matches, ordered by round then bracket position. Byes are included (isBye). */
  async knockout(tournamentId: number): Promise<Match[]> {
    return (await this.matchRows(tournamentId, 'm.ko_round IS NOT NULL')).map(toMatch);
  }

  /** Looks up any match of a tournament (pool or knockout). */
  async match(tournamentId: number, matchId: number): Promise<Match | null> {
    const rows = await this.matchRows(tournamentId, `m.id = ${Number(matchId)}`);
    return rows[0] ? toMatch(rows[0]) : null;
  }

  /**
   * Classic bracket pairs from seeded teams (seed 1 first): the bracket is the next power of
   * two, missing seeds become byes for the top seeds, and seeds 1 and 2 can only meet in the final.
   */
  static seededPairs(seeds: PoolTeam[]): [PoolTeam, PoolTeam | null][] {
    let size = 2;
    while (size < seeds.length) size *= 2;
    const order = bracketOrder(size);
    const pairs: [PoolTeam, PoolTeam | null][] = [];
    for (let i = 0; i < order.length; i += 2) {
      const a = seeds[order[i]! - 1] ?? null;
      const b = seeds[order[i + 1]! - 1] ?? null;
      pairs.push(a ? [a, b] : [b!, null]);
    }
    return pairs;
  }

  /** Creates the first knockout round from the given pairs (null opponent = bye) and format. */
  async startKnockout(
    tournamentId: number,
    pairs: [PoolTeam, PoolTeam | null][],
    format: KnockoutFormat,
  ): Promise<void> {
    if (pairs.length < 1) throw new Error('At least two teams are needed for a knockout.');
    await this.db.transaction(async (run) => {
      await run('DELETE FROM matches WHERE tournament_id = ? AND ko_round IS NOT NULL', [tournamentId]);
      await run('UPDATE tournaments SET ko_format = ? WHERE id = ?', [format, tournamentId]);
      for (const [i, [t1, t2]] of pairs.entries()) {
        await this.insertKoMatch(run, tournamentId, 1, i, t1, t2);
      }
    });
    await this.advanceKnockout(tournamentId);
  }

  /** Records a knockout result. Later rounds are rebuilt, since their line-up may change. */
  async setKnockoutWinner(tournamentId: number, matchId: number, winner: MatchWinner): Promise<void> {
    const match = await this.match(tournamentId, matchId);
    if (!match?.koRound) return;
    await this.db.transaction(async (run) => {
      await run('UPDATE matches SET winner = ? WHERE id = ?', [winner, matchId]);
      await run('DELETE FROM matches WHERE tournament_id = ? AND ko_round > ?', [tournamentId, match.koRound]);
    });
    await this.advanceKnockout(tournamentId);
  }

  /** While the latest round is complete and has more than one match, pairs its winners up. */
  private async advanceKnockout(tournamentId: number): Promise<void> {
    const format = (await this.db.query<{ ko_format: KnockoutFormat | null }>(
      'SELECT ko_format FROM tournaments WHERE id = ?',
      [tournamentId],
    ))[0]?.ko_format;
    if (format === 'playoff') {
      await this.advancePlayoff(tournamentId);
      return;
    }
    for (;;) {
      const all = await this.knockout(tournamentId);
      if (!all.length) return;
      const round = Math.max(...all.map((m) => m.koRound ?? 0));
      const current = all.filter((m) => m.koRound === round);
      if (current.length < 2 || current.some((m) => !m.winner)) return;
      const winners = current.map((m) => (m.winner === 1 ? m.team1 : m.team2));
      await this.db.transaction(async (run) => {
        for (let i = 0; i < winners.length; i += 2) {
          await this.insertKoMatch(run, tournamentId, round + 1, i / 2, winners[i]!, winners[i + 1] ?? null);
        }
      });
    }
  }

  /** Playoffs: Q1 + Eliminator → Qualifier 2 (loser Q1 v winner Elim) → Final (winner Q1 v winner Q2). */
  private async advancePlayoff(tournamentId: number): Promise<void> {
    const all = await this.knockout(tournamentId);
    const at = (round: number, pos: number) => all.find((m) => m.koRound === round && m.position === pos);
    const winner = (m: Match) => (m.winner === 1 ? m.team1 : m.team2);
    const loser = (m: Match) => (m.winner === 1 ? m.team2 : m.team1);
    const q1 = at(1, 0);
    const elim = at(1, 1);
    if (!q1?.winner || !elim?.winner) return;
    let q2 = at(2, 0);
    if (!q2) {
      await this.db.transaction((run) =>
        this.insertKoMatch(run, tournamentId, 2, 0, loser(q1), winner(elim)),
      );
      return;
    }
    if (q2.winner && !at(3, 0)) {
      await this.db.transaction((run) => this.insertKoMatch(run, tournamentId, 3, 0, winner(q1), winner(q2)));
    }
  }

  private async insertKoMatch(
    run: (sql: string, params?: unknown[]) => Promise<number | undefined>,
    tournamentId: number,
    round: number,
    position: number,
    team1: PoolTeam,
    team2: PoolTeam | null,
  ): Promise<void> {
    // A missing opponent is a bye: stored with an empty name and team1 as the winner.
    await run(
      `INSERT INTO matches (tournament_id, pool_id, position, team1_id, team1_name, team2_id, team2_name, winner, ko_round)
       VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?)`,
      [tournamentId, position, team1.teamId, team1.name, team2?.teamId ?? null, team2?.name ?? '', team2 ? null : 1, round],
    );
  }

  async setWinner(matchId: number, winner: MatchWinner): Promise<void> {
    await this.db.run('UPDATE matches SET winner = ? WHERE id = ?', [winner, matchId]);
  }

  async setToss(matchId: number, toss: Toss | null): Promise<void> {
    await this.db.run(
      `UPDATE matches SET toss_caller = ?, toss_call = ?, toss_result = ?, toss_winner = ?, toss_decision = ?
       WHERE id = ?`,
      [toss?.caller ?? null, toss?.call ?? null, toss?.result ?? null, toss?.winner ?? null, toss?.decision ?? null, matchId],
    );
  }

  /** Saves (or clears) the scores of several matches in one go. */
  async setScores(scores: { matchId: number; score: MatchScore | null }[]): Promise<void> {
    await this.db.transaction(async (run) => {
      for (const { matchId, score } of scores) {
        await run(
          `UPDATE matches SET bat_first = ?, inn1_runs = ?, inn1_balls = ?, inn2_runs = ?, inn2_balls = ?
           WHERE id = ?`,
          [
            score?.batFirst ?? null,
            score?.inn1Runs ?? null,
            score?.inn1Balls ?? null,
            score?.inn2Runs ?? null,
            score?.inn2Balls ?? null,
            matchId,
          ],
        );
      }
    });
  }

  async setTossDecision(matchId: number, decision: TossDecision | null): Promise<void> {
    await this.db.run('UPDATE matches SET toss_decision = ? WHERE id = ?', [decision, matchId]);
  }

  async setPoolStartTime(poolId: number, startTime: string | null): Promise<void> {
    await this.db.run('UPDATE tournament_pools SET start_time = ? WHERE id = ?', [startTime, poolId]);
  }

  async remove(id: number): Promise<void> {
    await this.db.transaction(async (run) => {
      await run('DELETE FROM matches WHERE tournament_id = ?', [id]);
      await run(
        'DELETE FROM pool_teams WHERE pool_id IN (SELECT id FROM tournament_pools WHERE tournament_id = ?)',
        [id],
      );
      await run('DELETE FROM tournament_pools WHERE tournament_id = ?', [id]);
      await run('DELETE FROM tournaments WHERE id = ?', [id]);
    });
  }
}
