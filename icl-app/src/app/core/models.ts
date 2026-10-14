export interface AppUser {
  id: number;
  username: string;
  pinHash: string;
  salt: string;
}

export interface Team {
  id?: number;
  logo: string | null;
  name: string;
  captainName: string;
  captainPhone: string;
  address: string;
  comment: string;
  createdAt?: string;
}

export type TeamSearchField = 'all' | 'name' | 'captain' | 'phone';

export type TournamentStatus = 'ongoing' | 'completed';

export interface PoolTeam {
  teamId: number | null;
  name: string;
  logo?: string | null;
}

export interface Pool {
  id?: number;
  name: string;
  /** 1-based court / ground number this pool plays on. */
  court: number | null;
  /** Court booking start time for this pool, "HH:mm". */
  startTime: string | null;
  /** Length of the court booking for this pool, in minutes. */
  bookingMinutes: number | null;
  teams: PoolTeam[];
}

/** 1 = team1 won, 2 = team2 won, null = not played yet. */
export type MatchWinner = 1 | 2 | null;

export type CoinSide = 'heads' | 'tails';
export type TossDecision = 'bat' | 'bowl';

export interface Toss {
  /** Which side called the toss: 1 = team1, 2 = team2. */
  caller: 1 | 2;
  call: CoinSide;
  result: CoinSide;
  winner: 1 | 2;
  /** Chosen by the toss winner at match time; null until then. */
  decision: TossDecision | null;
}

/** Scorecard summary used for Net Run Rate. Overs are stored as balls (6 per over). */
export interface MatchScore {
  /** Which side batted first: 1 = team1, 2 = team2. */
  batFirst: 1 | 2;
  /** First innings (the target is this + 1). */
  inn1Runs: number;
  inn1Balls: number;
  /** Second innings (the chase). */
  inn2Runs: number;
  inn2Balls: number;
}

export interface Match {
  id?: number;
  poolId?: number;
  position: number;
  team1: PoolTeam;
  team2: PoolTeam;
  winner: MatchWinner;
  toss: Toss | null;
  score: MatchScore | null;
  /** Knockout round (1 = first knockout round); undefined/null for pool matches. */
  koRound?: number | null;
  /** Knockout bye: team1 advances without playing. */
  isBye?: boolean;
}

export interface PoolFixtures {
  pool: Pool;
  matches: Match[];
}

export interface Tournament {
  id?: number;
  name: string;
  season?: number | null;
  /** ISO date, YYYY-MM-DD */
  playedOn: string;
  status: TournamentStatus;
  championTeamId: number | null;
  /** Snapshot of the champion's name, kept even if the team is later deleted. */
  championTeamName: string | null;
  championLogo?: string | null;
  mvpName: string | null;
  courtCount?: number | null;
  /** Match length and overs as they were when the tournament started. */
  matchMinutes?: number | null;
  overs?: number | null;
  /** How many top teams from each pool go through to the next round. */
  qualifyCount?: number | null;
  pools?: Pool[];
}
