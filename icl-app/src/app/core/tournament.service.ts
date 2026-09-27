import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  CoinSide,
  Match,
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
  return ordered.map(([team1, team2]) => ({ team1, team2, winner: null, toss: null }));
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
    format: { matchMinutes: number; overs: number },
  ): Promise<number> {
    return this.db.transaction(async (run) => {
      const id = (await run(
        `INSERT INTO tournaments (name, season, played_on, status, court_count, match_minutes, overs)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [seasonName(season), season, playedOn, 'ongoing', courtCount, format.matchMinutes, format.overs],
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
  async fixtures(tournamentId: number): Promise<PoolFixtures[]> {
    const pools = await this.pools(tournamentId);
    const rows = await this.db.query<{
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
      t1_name: string | null;
      t1_logo: string | null;
      t2_name: string | null;
      t2_logo: string | null;
    }>(
      `SELECT m.*, a.name AS t1_name, a.logo AS t1_logo, b.name AS t2_name, b.logo AS t2_logo
       FROM matches m
       LEFT JOIN teams a ON a.id = m.team1_id
       LEFT JOIN teams b ON b.id = m.team2_id
       WHERE m.tournament_id = ?
       ORDER BY m.position`,
      [tournamentId],
    );
    return pools.map((pool) => ({
      pool,
      matches: rows
        .filter((r) => r.pool_id === pool.id)
        .map((r) => ({
          id: r.id,
          poolId: r.pool_id,
          position: r.position,
          team1: { teamId: r.team1_id, name: r.t1_name ?? r.team1_name, logo: r.t1_logo },
          team2: { teamId: r.team2_id, name: r.t2_name ?? r.team2_name, logo: r.t2_logo },
          winner: r.winner,
          toss:
            r.toss_caller && r.toss_call && r.toss_result && r.toss_winner
              ? {
                  caller: r.toss_caller,
                  call: r.toss_call,
                  result: r.toss_result,
                  winner: r.toss_winner,
                  decision: r.toss_decision,
                }
              : null,
        })),
    }));
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
