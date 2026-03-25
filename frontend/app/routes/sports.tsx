import { matchesFetcher, upcomingMatchesFetcher } from '~/shared/fetchers';
import type { Route } from './+types/sports';
import type { Match, UpcomingMatch } from '~/types/sports';
import { calcTeamRecords } from '~/utils/sports/records';
import useIsMobile from '~/hooks/useIsMobile';
import useDarkMode from '~/hooks/useDarkMode';
import { motion } from 'framer-motion';
import TodayMatchesCard from '~/components/sports/TodayMatchesCard';
import ResultsCard from '~/components/sports/ResultsCard';
import RecordsCard from '~/components/sports/RecordsCard';
import { getTodayMatches, sortTodayMatches } from '~/utils/sports/todayMatches';
import { useState } from 'react';
import HamburgerButton from '~/components/home/nav/HamburgerButton';
import Nav from '~/components/home/nav/Nav';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RL Clock | Sports' },
    { name: 'description', content: 'RL Recent Sports Results' },
  ];
}

export async function clientLoader() {
  // Fetch sports
  const [matchesResult, upcomingMatchesResult] = await Promise.all([
    matchesFetcher.get(),
    upcomingMatchesFetcher.get(),
  ]);

  if (!matchesResult.success) throw new Error(matchesResult.errorMessage);
  if (!upcomingMatchesResult.success)
    throw new Error(upcomingMatchesResult.errorMessage);

  return {
    matches: matchesResult.data,
    upcomingMatches: upcomingMatchesResult.data,
  };
}

const createStyles = (isMobile: boolean, isDarkMode: boolean) => {
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

  const title: React.CSSProperties = {
    fontSize: isMobile ? 26 : 32,
    color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
    margin: '0 0 1rem',
    textAlign: 'center',
  };

  return { container, main, title };
};

export default function Sports({ loaderData }: Route.ComponentProps) {
  const {
    matches,
    upcomingMatches,
  }: { matches: Match[]; upcomingMatches: UpcomingMatch[] } = loaderData;
  const isDarkMode = useDarkMode();
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const styles = createStyles(isMobile, isDarkMode);

  const recordsResult = calcTeamRecords(matches);
  if (!recordsResult.success) throw new Error(recordsResult.errorMessage);
  const records = recordsResult.data;

  const todayMatches = sortTodayMatches(getTodayMatches(upcomingMatches));

  console.log(matches);
  console.log(records);
  console.log(upcomingMatches);
  console.log(todayMatches);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <HamburgerButton
        isDarkMode={isDarkMode}
        onClick={() => setNavOpen(true)}
      />
      <Nav isDarkMode={isDarkMode} isOpen={navOpen} onClose={() => null} />

      <main style={styles.main}>
        <h1 style={styles.title}>RL Fox Den</h1>
        <TodayMatchesCard
          todayMatches={todayMatches}
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
