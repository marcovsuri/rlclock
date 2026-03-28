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
import HamburgerButton from '~/components/global/nav/HamburgerButton';
import Nav from '~/components/global/nav/Nav';
import useIsMobile from '~/hooks/useIsMobile';
import Footer from '~/components/home/Footer';
import useTheme from '~/hooks/useTheme';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'RL Clock' }, { name: 'description', content: 'RL Clock' }];
}

export async function clientLoader() {
  const [scheduleResult, matchesResult, menuResult] = await Promise.all([
    scheduleFetcher.get(),
    matchesFetcher.get(),
    menuFetcher.get(),
  ]);
  if (!scheduleResult.success) console.error(scheduleResult.errorMessage);
  if (!matchesResult.success) console.error(matchesResult.errorMessage);
  if (!menuResult.success) console.error(menuResult.errorMessage);
  return {
    schedule: scheduleResult.success ? scheduleResult.data : null,
    matches: matchesResult.success ? matchesResult.data : null,
    menu: menuResult.success ? menuResult.data : null,
  };
}

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const page: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  const {
    schedule,
    matches,
    menu,
  }: { schedule: Schedule | null; matches: Match[] | null; menu: Menu | null } =
    loaderData;
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { isDark } = useTheme();

  const styles = createStyles(isMobile, isDark);
  const lunchItems = menu ? menu['Entrées'].map((i) => i.name) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      <HamburgerButton isDark={isDark} onClick={() => setNavOpen(true)} />
      <Nav
        isMobile={isMobile}
        isDark={isDark}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div style={styles.clockWrapper}>
        <Clock isMobile={isMobile} schedule={schedule} isDark={isDark} />
      </div>

      <div>
        <div style={styles.widgetWrapper}>
          <WidgetContainer isMobile={isMobile}>
            <LunchWidget items={lunchItems} isDark={isDark} />
            <SportsResultsWidget matches={matches} isDark={isDark} />
          </WidgetContainer>
        </div>
        <Footer isMobile={isMobile} isDark={isDark} />
      </div>
    </motion.div>
  );
}
