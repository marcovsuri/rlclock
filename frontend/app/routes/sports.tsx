import { sportsFetcher } from '~/shared/fetchers';
import type { Route } from './+types/sports';
import type { Match } from '~/types/sports';

export async function clientLoader() {
  // Fetch sports
  const sportsResult = await sportsFetcher.get();
  if (!sportsResult.success) throw new Error(sportsResult.errorMessage);

  return { matches: sportsResult.data };
}

export default function Sports({ loaderData }: Route.ComponentProps) {
  const { matches }: { matches: Match[] } = loaderData;

  console.log(matches);

  return <h1>Sports</h1>;
}
