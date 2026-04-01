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
    minHeight: '100vh',
    position: 'relative',
    color: isDark ? '#E8EAED' : '#202124',
  };

  const shell: React.CSSProperties = {
    flex: 1,
  };

  const content: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    scrollbarWidth: 'none',
    opacity: 1,
  };

  const main: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'center',
    alignItems: 'center',
    padding: isMobile ? '3.6rem 0.8rem 1.25rem' : '2vw',
    gap: isMobile ? '1rem' : '2vw',
    textAlign: 'center',
    boxSizing: 'border-box',
    width: '100%',
  };

  const section: React.CSSProperties = {
    width: isMobile ? 'min(93vw, 720px)' : '34vw',
  };

  const footer: React.CSSProperties = {
    width: '100%',
  };

  const hiddenHeading: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0px, 0px, 0px, 0px)',
    whiteSpace: 'nowrap',
  };

  return { page, shell, content, main, section, footer, hiddenHeading };
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

  const lunchItems = menu
    ? menu['Entrées'].slice(0, 5).map((i) => i.name)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.page}
    >
      <HamburgerButton
        isDark={isDark}
        onClick={() => setNavOpen((current) => !current)}
      />
      <Nav
        isMobile={isMobile}
        isDark={isDark}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div style={styles.shell}>
        <div style={styles.content}>
          <main style={styles.main}>
            <h1 style={styles.hiddenHeading}>RL Clock Dashboard</h1>

            <div style={styles.section}>
              <Clock isMobile={isMobile} schedule={schedule} isDark={isDark} />
            </div>

            <WidgetContainer isMobile={isMobile}>
              <LunchWidget
                items={lunchItems}
                isDark={isDark}
                isMobile={isMobile}
              />
              <SportsResultsWidget
                matches={matches}
                isDark={isDark}
                isMobile={isMobile}
              />
            </WidgetContainer>
          </main>

          <div style={styles.footer}>
            <Footer isMobile={isMobile} isDark={isDark} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
