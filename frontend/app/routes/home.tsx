import type { Schedule } from '~/types/clock';
import type { Route } from './+types/home';
import Clock from '~/components/clock/Clock';
import { scheduleFetcher } from '~/shared/fetchers';
import { motion } from 'framer-motion';

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

const createStyles = () => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    scrollbarWidth: 'none',
  };

  return { container };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { schedule }: { schedule: Schedule } = loaderData;
  const styles = createStyles();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.container}
      >
        <Clock schedule={schedule} />
      </motion.div>
    </>
  );
}
