import { handleError } from '~/shared/error';
import type { Result } from '~/types/global';
import type { Match, MatchRecord, TeamRecord } from '~/types/sports';

/** A `TeamRecord` annotated with whether the team is varsity */
type TeamRecordEntry = { record: TeamRecord; isVarsity: boolean };

/**
 * Derives a win/tie/loss record for each team from a list of matches.
 * Returns entries annotated with `isVarsity`, sorted with varsity teams
 * first and alphabetically within each group.
 */
function calcTeamRecords(matches: Match[]): Result<TeamRecordEntry[]> {
  try {
    // Accumulate records in a map keyed by team name
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

    // Convert map to array, annotate each entry with isVarsity,
    // then sort: varsity first, alphabetically within each group
    const records: TeamRecordEntry[] = Array.from(map.entries())
      .map(([team, record]) => ({
        record: { team, record },
        isVarsity: team.startsWith('Varsity'),
      }))
      .sort((a, b) => {
        if (a.isVarsity && !b.isVarsity) return -1;
        if (!a.isVarsity && b.isVarsity) return 1;
        return a.record.team.localeCompare(b.record.team);
      });

    return { success: true, data: records };
  } catch (error) {
    return handleError(error);
  }
}

export { calcTeamRecords };
export type { TeamRecordEntry };
