import type { Match, MatchResult } from '~/types/sports';

export type FlatRow = {
  date: string;
  team: string;
  opponent: string;
  score: string;
  outcome: 'Win' | 'Loss' | 'Tie' | '';
};

export type GroupedResult = {
  date: string;
  rows: FlatRow[];
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Decode HTML entities like &amp; → & */
export const decodeEntities = (text: string): string => {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
};

const toOutcomeLabel = (result: MatchResult): 'Win' | 'Loss' | 'Tie' => {
  if (result === 'win') return 'Win';
  if (result === 'loss') return 'Loss';
  return 'Tie';
};

/** Flatten matches into individual per-opponent rows */
export const flattenMatches = (matches: Match[]): FlatRow[] => {
  const rows: FlatRow[] = [];
  for (const match of matches) {
    for (let i = 0; i < match.opponents.length; i++) {
      const raw = match.scores[i] ?? '';
      const [a, b] = raw.split(/-+/).map(Number);
      rows.push({
        date: match.date,
        team: decodeEntities(match.team),
        opponent: decodeEntities(match.opponents[i]),
        score: raw ? raw.replace(/-+/g, ' – ') : '',
        outcome:
          Number.isFinite(a) && Number.isFinite(b)
            ? toOutcomeLabel(match.results[i])
            : '',
      });
    }
  }
  return rows;
};

/** Group flat rows by date, preserving order */
export const groupByDate = (rows: FlatRow[]): GroupedResult[] => {
  const groups: GroupedResult[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last?.date === row.date) last.rows.push(row);
    else groups.push({ date: row.date, rows: [row] });
  }
  return groups;
};

/** Slice grouped results to show at most `limit` rows total */
export const sliceGroups = (
  groups: GroupedResult[],
  limit: number,
): GroupedResult[] => {
  let count = 0;
  const result: GroupedResult[] = [];
  for (const group of groups) {
    if (count >= limit) break;
    const remaining = limit - count;
    const rows = group.rows.slice(0, remaining);
    result.push({ date: group.date, rows });
    count += rows.length;
  }
  return result;
};

/** Build a map of "M/D" date strings to their inferred full year */
export const buildDateYearMap = (
  groups: GroupedResult[],
): Map<string, number> => {
  const map = new Map<string, number>();
  let effectiveYear = new Date().getFullYear();
  let prevMonth = new Date().getMonth() + 1;
  for (const group of groups) {
    const [m] = group.date.split('/').map(Number);
    if (m && m > prevMonth) effectiveYear--;
    if (m) prevMonth = m;
    map.set(group.date, effectiveYear);
  }
  return map;
};

/** Format "M/D" as "Mon D, YYYY" */
export const formatDate = (
  md: string,
  yearMap: Map<string, number>,
): string => {
  const [month, day] = md.split('/').map(Number);
  if (!month || !day) return md;
  const year = yearMap.get(md) ?? new Date().getFullYear();
  return `${MONTHS[month - 1]} ${day}, ${year}`;
};

/** Return the display color for a given outcome */
export const outcomeColor = (
  outcome: FlatRow['outcome'],
  isDarkMode: boolean,
): string => {
  if (outcome === 'Win') return isDarkMode ? '#4ade80' : '#15803d';
  return isDarkMode ? '#B0B5BA' : '#5F6368';
};
