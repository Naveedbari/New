import { Match, MatchScore, PoolFixtures, PoolTeam } from './models';

/** Points awarded for a win; a loss scores nothing. */
export const POINTS_PER_WIN = 2;

/**
 * q    – qualified (pool finished, place secured)
 * zone – currently in a qualifying place (pool still running)
 * tie  – level on points across the qualification cut-off; needs NRR to decide
 * out  – pool finished, did not qualify
 */
export type QualifyStatus = 'q' | 'zone' | 'tie' | 'out' | null;

export interface StandingRow {
  team: PoolTeam;
  played: number;
  won: number;
  lost: number;
  remaining: number;
  points: number;
  /** Net Run Rate, or null when the team has no scored matches. */
  nrr: number | null;
  status: QualifyStatus;
}

export interface PoolStandings {
  rows: StandingRow[];
  /** Every match in the pool has a result. */
  complete: boolean;
  /** Every match in the pool has runs/overs entered, so NRR can rank teams. */
  nrrComplete: boolean;
  /** Some match has runs/overs entered. */
  hasScores: boolean;
  /** Teams level on points straddle the qualification cut-off (before NRR). */
  tieOnPoints: boolean;
  /** Tie is still unresolved (no NRR yet, or NRR also level). */
  tieUnresolved: boolean;
  qualifyCount: number;
}

const sameTeam = (a: PoolTeam, b: PoolTeam) =>
  a.teamId != null && b.teamId != null ? a.teamId === b.teamId : a.name === b.name;

/** "4.3" overs → 27 balls. Returns null for invalid input (balls part must be 0–5). */
export function oversToBalls(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const text = String(value).trim();
  if (!/^\d+(\.\d)?$/.test(text)) return null;
  const [whole, part] = text.split('.');
  const balls = Number(part ?? 0);
  if (balls > 5) return null;
  return Number(whole) * 6 + balls;
}

/** 27 balls → "4.3". */
export function ballsToOvers(balls: number): string {
  const rest = balls % 6;
  return rest ? `${Math.floor(balls / 6)}.${rest}` : `${balls / 6}`;
}

/** Runs and balls a side scored and conceded in one scored match. */
function inningsFor(score: MatchScore, side: 1 | 2) {
  const battedFirst = score.batFirst === side;
  return battedFirst
    ? { runsFor: score.inn1Runs, ballsFaced: score.inn1Balls, runsAgainst: score.inn2Runs, ballsBowled: score.inn2Balls }
    : { runsFor: score.inn2Runs, ballsFaced: score.inn2Balls, runsAgainst: score.inn1Runs, ballsBowled: score.inn1Balls };
}

/**
 * Net Run Rate = (total runs scored ÷ total overs faced) − (total runs conceded ÷ total overs bowled),
 * over the team's scored matches. Overs count as balls ÷ 6.
 */
export function netRunRate(team: PoolTeam, matches: Match[]): number | null {
  let runsFor = 0;
  let ballsFaced = 0;
  let runsAgainst = 0;
  let ballsBowled = 0;
  for (const m of matches) {
    if (!m.score) continue;
    const side = sameTeam(m.team1, team) ? 1 : sameTeam(m.team2, team) ? 2 : null;
    if (!side) continue;
    const inn = inningsFor(m.score, side);
    runsFor += inn.runsFor;
    ballsFaced += inn.ballsFaced;
    runsAgainst += inn.runsAgainst;
    ballsBowled += inn.ballsBowled;
  }
  if (!ballsFaced || !ballsBowled) return null;
  return runsFor / (ballsFaced / 6) - runsAgainst / (ballsBowled / 6);
}

export function computeStandings(group: PoolFixtures, qualifyCount: number): PoolStandings {
  const matches = group.matches;
  const complete = matches.length > 0 && matches.every((m) => m.winner);
  const nrrComplete = matches.length > 0 && matches.every((m) => m.score);
  const hasScores = matches.some((m) => m.score);

  const rows: StandingRow[] = group.pool.teams.map((team) => {
    const games = matches.filter((m) => sameTeam(m.team1, team) || sameTeam(m.team2, team));
    const played = games.filter((m) => m.winner);
    const won = played.filter((m) => sameTeam(m.winner === 1 ? m.team1 : m.team2, team)).length;
    return {
      team,
      played: played.length,
      won,
      lost: played.length - won,
      remaining: games.length - played.length,
      points: won * POINTS_PER_WIN,
      nrr: netRunRate(team, matches),
      status: null,
    };
  });

  const useNrr = nrrComplete;
  rows.sort(
    (a, b) =>
      b.points - a.points ||
      (useNrr ? (b.nrr ?? -Infinity) - (a.nrr ?? -Infinity) : 0) ||
      a.played - b.played ||
      a.team.name.localeCompare(b.team.name),
  );

  const n = Math.min(Math.max(qualifyCount, 0), rows.length);
  const hasCutoff = n > 0 && n < rows.length;
  const cutoffPoints = hasCutoff ? rows[n - 1]!.points : null;
  const tieOnPoints = hasCutoff && rows[n]!.points === cutoffPoints;
  const nrrLevel =
    hasCutoff && useNrr && Math.abs((rows[n - 1]!.nrr ?? 0) - (rows[n]!.nrr ?? 0)) < 1e-9;
  const tieUnresolved = tieOnPoints && (!useNrr || nrrLevel);

  rows.forEach((row, i) => {
    if (!complete) {
      row.status = i < n ? 'zone' : null;
    } else if (tieUnresolved && row.points === cutoffPoints) {
      row.status = 'tie';
    } else {
      row.status = i < n ? 'q' : 'out';
    }
  });

  return { rows, complete, nrrComplete, hasScores, tieOnPoints, tieUnresolved, qualifyCount: n };
}
