import { matchesFetcher } from '~/shared/fetchers';
import type { Route } from './+types/sports';
import type { Match } from '~/types/sports';
import { calcTeamRecords } from '~/utils/sports';

export async function clientLoader() {
  // Fetch sports
  const matchesResult = await matchesFetcher.get();
  if (!matchesResult.success) throw new Error(matchesResult.errorMessage);

  return { matches: matchesResult.data, upcomingMatches: [] };
}

export default function Sports({ loaderData }: Route.ComponentProps) {
  const {
    matches,
    upcomingMatches,
  }: { matches: Match[]; upcomingMatches: never[] } = loaderData;

  const recordsResult = calcTeamRecords(matches);
  if (!recordsResult.success) throw new Error(recordsResult.errorMessage);
  const records = recordsResult;

  console.log(matches);
  console.log(records);

  return <h1>Sports</h1>;
}
