import React from 'react';
import type { Schedule } from '~/types/clock';
import type { Match } from '~/types/sports';
import type { Menu } from '~/types/lunch';
import type { Route } from './+types/home';
import {
  scheduleFetcher,
  matchesFetcher,
  menuFetcher,
} from '~/shared/fetchers';
import { motion } from 'framer-motion';
import Clock from '~/components/home/clock/Clock';
import LunchWidget from '~/components/home/widgets/LunchWidget';
import SportsResultsWidget from '~/components/home/widgets/SportsResultsWidget';
import WidgetContainer from '~/components/home/widgets/WidgetContainer';

const isDarkMode = true; // TODO: user preference

export function meta({}: Route.MetaArgs) {
  return [{ title: 'RL Clock' }, { name: 'description', content: 'RL Clock' }];
}

export async function clientLoader(): Promise<{
  schedule: Schedule;
  matches: Match[];
  menu: Menu;
}> {
  const [scheduleResult, matchesResult, menuResult] = await Promise.all([
    scheduleFetcher.get(),
    matchesFetcher.get(),
    menuFetcher.get(),
  ]);
  if (!scheduleResult.success) throw new Error(scheduleResult.errorMessage);
  if (!matchesResult.success) throw new Error(matchesResult.errorMessage);
  if (!menuResult.success) throw new Error(menuResult.errorMessage);
  return {
    schedule: scheduleResult.data,
    matches: matchesResult.data,
    menu: menuResult.data,
  };
}

const createStyles = () => {
  const page: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // exact viewport — no scroll
    width: '100%',
    overflow: 'hidden',
    scrollbarWidth: 'none',
  };
  const clockWrapper: React.CSSProperties = {
    flex: '0 0 auto', // clock shrinks/grows only as its content needs
  };
  const widgetWrapper: React.CSSProperties = {
    flex: '1 1 0', // widgets take whatever remains
    display: 'flex',
    alignItems: 'stretch',
    minHeight: 0, // allows flex child to shrink below content size
  };
  return { page, clockWrapper, widgetWrapper };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { schedule, matches, menu } = loaderData;
  const styles = createStyles();
  const lunchItems = menu['Entrées'].map((i) => i.name);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      <div style={styles.clockWrapper}>
        <Clock schedule={schedule} />
      </div>
      <div style={styles.widgetWrapper}>
        <WidgetContainer>
          <LunchWidget items={lunchItems} isDarkMode={isDarkMode} />
          <SportsResultsWidget matches={matches} isDarkMode={isDarkMode} />
        </WidgetContainer>
      </div>
    </motion.div>
  );
}
