import { matchesFetcher } from '~/shared/fetchers';
import type { Route } from './+types/sports';
import type { Match } from '~/types/sports';

export async function clientLoader() {
  // Fetch sports
  const matchesResult = await matchesFetcher.get();
  if (!matchesResult.success) throw new Error(matchesResult.errorMessage);

  return { matches: matchesResult.data, upcomingMatches: [] };
}

export default function Sports({ loaderData }: Route.ComponentProps) {
  const { matches }: { matches: Match[] } = loaderData;

  console.log(matches);

  return <h1>Sports</h1>;
}
