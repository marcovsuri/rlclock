import type { UpcomingMatch } from '~/types/sports';

/** Returns only the matches scheduled for today in Eastern time */
function getTodayMatches(matches: UpcomingMatch[]): UpcomingMatch[] {
  const now = new Date();
  const today = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  return matches.filter((match) => match.date === today);
}

/** Returns a sort priority (0–3) based on varsity and home status */
function getMatchPriority(match: UpcomingMatch): number {
  const isVarsity = match.team.toLowerCase().includes('varsity');
  const isHome = match.location.toLowerCase().includes('home');

  if (isVarsity && isHome) return 0;
  if (!isVarsity && isHome) return 1;
  if (isVarsity && !isHome) return 2;
  return 3;
}

/** Sorts upcoming matches by: Varsity Home → JV Home → Varsity Away → JV Away */
function sortTodayMatches(matches: UpcomingMatch[]): UpcomingMatch[] {
  return [...matches].sort((a, b) => getMatchPriority(a) - getMatchPriority(b));
}

export { getTodayMatches, sortTodayMatches };
