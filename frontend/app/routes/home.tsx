import React, { useState } from 'react';
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
import HamburgerButton from '~/components/home/nav/HamburgerButton';
import Nav from '~/components/home/nav/Nav';
import useIsMobile from '~/hooks/useIsMobile';
import Footer from '~/components/home/Footer';
import useTheme from '~/hooks/useTheme';

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

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const page: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    width: '100%',
    overflowY: 'auto',
    paddingTop: isMobile ? '4.75rem' : '5.25rem',
    paddingBottom: isMobile ? '1.5rem' : '2rem',
    color: isDark ? '#E8EAED' : '#202124',
  };

  const clockWrapper: React.CSSProperties = {
    flex: '0 0 auto',
    width: '100%',
  };

  const widgetWrapper: React.CSSProperties = {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    minHeight: 0,
  };

  return { page, clockWrapper, widgetWrapper };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { schedule, matches, menu } = loaderData;
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { isDark } = useTheme();

  const styles = createStyles(isMobile, isDark);
  const lunchItems = menu['Entrées'].map((i) => i.name);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      <HamburgerButton isDark={isDark} onClick={() => setNavOpen(true)} />
      <Nav isDark={isDark} isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <div style={styles.clockWrapper}>
        <Clock schedule={schedule} isDark={isDark} />
      </div>
      <div style={styles.widgetWrapper}>
        <WidgetContainer isMobile={isMobile}>
          <LunchWidget items={lunchItems} isDark={isDark} />
          <SportsResultsWidget matches={matches} isDark={isDark} />
        </WidgetContainer>
      </div>

      <Footer isDark={isDark} />
    </motion.div>
  );
}
