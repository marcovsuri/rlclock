import type { Schedule } from '~/types/clock';
import type { Route } from './+types/home';
import Clock from '~/components/clock/Clock';
import { scheduleFetcher } from '~/shared/fetchers';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function clientLoader() {
  // Fetch schedule
  const scheduleResult = await scheduleFetcher.get();
  if (!scheduleResult.success) throw new Error(scheduleResult.errorMessage);

  return { schedule: scheduleResult.data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { schedule }: { schedule: Schedule } = loaderData;
  return (
    <>
      <Clock schedule={schedule} />
    </>
  );
}
