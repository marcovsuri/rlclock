import { matchesFetcher } from '~/shared/fetchers';
import type { Route } from './+types/sports';
import type { Match } from '~/types/sports';
import { calcTeamRecords } from '~/utils/sports/records';
import useIsMobile from '~/hooks/useIsMobile';
import { motion } from 'framer-motion';
import BackButton from '~/components/global/BackButton';
import TodayMatchesCard from '~/components/sports/TodayMatchesCard';
import ResultsCard from '~/components/sports/ResultsCard';
import RecordsCard from '~/components/sports/RecordsCard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Sports' },
    { name: 'description', content: 'RL Recent Sports Results' },
  ];
}

export async function clientLoader() {
  // Fetch sports
  const matchesResult = await matchesFetcher.get();
  if (!matchesResult.success) throw new Error(matchesResult.errorMessage);

  return { matches: matchesResult.data, upcomingMatches: [] };
}

const createStyles = (isMobile: boolean) => {
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  };

  const main: React.CSSProperties = {
    width: isMobile ? '92vw' : '40vw',
    margin: '3vh auto',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '2vw' : '1vw',
  };

  const hiddenTitle: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
  };

  return { container, main, hiddenTitle };
};

export default function Sports({ loaderData }: Route.ComponentProps) {
  const {
    matches,
    upcomingMatches,
  }: { matches: Match[]; upcomingMatches: never[] } = loaderData;
  const isDarkMode = true; // Todo: make based on user preferences
  const isMobile = useIsMobile();
  const styles = createStyles(isMobile);

  const recordsResult = calcTeamRecords(matches);
  if (!recordsResult.success) throw new Error(recordsResult.errorMessage);
  const records = recordsResult.data;

  console.log(matches);
  console.log(records);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <main style={styles.main}>
        <h1 style={styles.hiddenTitle}>Sports</h1>
        <div style={{ alignSelf: 'flex-start' }}>
          <BackButton text={'Home'} isDarkMode={isDarkMode} />
        </div>
        <TodayMatchesCard
          todayMatches={upcomingMatches}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />

        {records.length > 0 && (
          <RecordsCard
            records={records}
            isMobile={isMobile}
            isDarkMode={isDarkMode}
          />
        )}

        <ResultsCard
          results={matches}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
      </main>
    </motion.div>
  );
}
