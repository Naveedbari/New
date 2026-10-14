import { KnockoutFormat, Match, PoolTeam } from './models';

export interface BracketSlot {
  team: PoolTeam | null;
  won: boolean;
  lost: boolean;
}

/** One box in the bracket. `match` is null for future matches not created yet (TBD). */
export interface BracketMatch {
  round: number;
  index: number;
  match: Match | null;
  top: BracketSlot;
  bottom: BracketSlot;
  isBye: boolean;
}

const empty = (team: PoolTeam | null): BracketSlot => ({ team, won: false, lost: false });

/** Winner of a bracket box, if decided (a bye counts as won by its only team). */
export function bracketWinner(b: BracketMatch | undefined): PoolTeam | null {
  if (!b) return null;
  if (b.isBye) return b.top.team;
  const w = b.match?.winner;
  return w === 1 ? b.top.team : w === 2 ? b.bottom.team : null;
}

/**
 * Full bracket from the knockout matches stored so far: every round from the first
 * round to the final, with future matches filled in as far as results allow.
 */
export function buildBracket(ko: Match[]): BracketMatch[][] {
  const firstRound = ko.filter((m) => m.koRound === 1);
  if (!firstRound.length) return [];
  const rounds: BracketMatch[][] = [];
  let count = firstRound.length;
  for (let r = 1; count >= 1; r++, count /= 2) {
    const round: BracketMatch[] = [];
    for (let i = 0; i < count; i++) {
      const match = ko.find((m) => m.koRound === r && m.position === i) ?? null;
      if (match) {
        const w = match.winner;
        round.push({
          round: r,
          index: i,
          match,
          isBye: !!match.isBye,
          top: { team: match.team1, won: w === 1, lost: w === 2 },
          bottom: match.isBye ? empty(null) : { team: match.team2, won: w === 2, lost: w === 1 },
        });
      } else {
        const prev = rounds[r - 2] ?? [];
        round.push({
          round: r,
          index: i,
          match: null,
          isBye: false,
          top: empty(bracketWinner(prev[i * 2])),
          bottom: empty(bracketWinner(prev[i * 2 + 1])),
        });
      }
    }
    rounds.push(round);
    if (count === 1) break;
  }
  return rounds;
}

/** The knockout winner, once the final is decided (playoffs: the round-3 final). */
export function knockoutChampion(ko: Match[], format: KnockoutFormat | null | undefined): PoolTeam | null {
  if (!ko.length) return null;
  const last = Math.max(...ko.map((m) => m.koRound ?? 0));
  if (format === 'playoff' && last < 3) return null;
  const finals = ko.filter((m) => m.koRound === last);
  if (finals.length !== 1) return null;
  const f = finals[0]!;
  return f.winner === 1 ? f.team1 : f.winner === 2 ? f.team2 : null;
}
