import { handleError } from '~/shared/error';
import type { Result } from '~/types/global';
import type { Match, MatchRecord, TeamRecord } from '~/types/sports';

/**
 * Derives a win/tie/loss record for each team from a list of matches.
 * Teams are sorted alphabetically in the returned array.
 */
function calcTeamRecords(matches: Match[]): Result<TeamRecord[]> {
  try {
    const map = new Map<string, MatchRecord>();

    for (const match of matches) {
      for (let i = 0; i < match.opponents.length; i++) {
        // Scores are stored as "A-B" strings e.g. "3-1"
        const [a, b] = match.scores[i].split(/-+/).map(Number);

        // Skip malformed or missing scores
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;

        // Unescape HTML entities in team names scraped from the web
        const team = match.team.replace(/&amp;/g, '&');

        if (!map.has(team)) map.set(team, { wins: 0, ties: 0, losses: 0 });

        const rec = map.get(team)!;
        if (match.results[i] === 'win') rec.wins++;
        else if (match.results[i] === 'loss') rec.losses++;
        else rec.ties++;
      }
    }

    // Convert map to array and sort alphabetically by team name (varsity first)
    const records: TeamRecord[] = Array.from(map.entries())
      .map(([team, record]) => ({ team, record }))
      .sort((a, b) => {
        const aIsVarsity = a.team.startsWith('Varsity');
        const bIsVarsity = b.team.startsWith('Varsity');

        if (aIsVarsity && !bIsVarsity) return -1;
        if (!aIsVarsity && bIsVarsity) return 1;
        return a.team.localeCompare(b.team);
      });

    return { success: true, data: records };
  } catch (error) {
    return handleError(error);
  }
}

export { calcTeamRecords };
