import { KnockoutFormat, Match, PoolTeam } from './models';

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
