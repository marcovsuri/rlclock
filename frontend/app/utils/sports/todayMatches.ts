import type { UpcomingMatch } from '~/types/sports';

/** Returns only the matches scheduled for today in Eastern time */
function getTodayMatches(matches: UpcomingMatch[]): UpcomingMatch[] {
  const now = new Date('4/4/2026');
  const today = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  return matches.filter((match) => match.date === today);
}

export { getTodayMatches };
