import React from 'react';
import { motion } from 'framer-motion';
import Clock from '../components/home/Clock';
import InfoCard from '../components/home/InfoCard';
import useIsMobile from '../hooks/useIsMobile';
import { useEffect, useState } from 'react';
import getMenu from '../core/lunchFetcher';
import { Menu } from '../types/lunch';
import getSportsEvents from '../core/sportsFetcher';
import { TeamEvent } from '../types/sports';

interface HomeProps {
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  const [menu, setMenu] = useState<Menu | undefined>(undefined);
  const [pastResults, setPastResults] = useState<
    TeamEvent[] | undefined | null
  >(undefined);

  useEffect(() => {
    getMenu().then((result) => {
      if (result.success) {
        setMenu(result.data);
      }
    });
  }, []);

  useEffect(() => {
    document.title = 'RL Clock';
    getSportsEvents().then((response) => {
      if (response.success) {
        setPastResults(response.data.slice(0, 4));
      } else {
        setPastResults(null);
      }
    });
  }, []);

  const lunchFeatures = menu?.Entrées?.slice(0, 4)
    .flatMap((item) => {
      return item?.name;
    })
    .join('\n');

  const gameResultsFeature = pastResults
    ?.flatMap((result) => {
      const winCount = result.wins.filter(Boolean).length;
      const lossCount = result.wins.filter((win) => !win).length;

      let outcome;
      if (winCount > 0 && lossCount > 0) {
        outcome = `(${winCount}-${lossCount})`;
      } else if (winCount > 0) {
        outcome = 'Win';
      } else {
        outcome = 'Loss';
      }

      return `${result.team} → ${result.scores[0].replace(
        /-+/g,
        ' - '
      )} ${outcome}`;
    })
    .join('\n');

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',
    scrollbarWidth: 'none',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1vw',
    gap: isMobile ? '2vh' : '2vw',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  const clockStyle: React.CSSProperties = {
    width: isMobile ? '100%' : 'auto',
    padding: '1vw',
  };

  const cardsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isMobile ? '2vh' : '2vw',
    width: isMobile ? '100%' : 'auto',
    padding: '1vw',
    boxSizing: 'border-box',
  };

  const hasLunch =
    menu !== undefined &&
    (menu?.Entrées?.length > 0 ||
      menu?.['Sides and Vegetables']?.length > 0 ||
      menu?.Soups?.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      {/* Main Content */}
      <div style={contentStyle}>
        <div style={clockStyle}>
          <Clock isDarkMode={isDarkMode} />
        </div>
        <div style={cardsStyle}>
          <InfoCard
            title="Today's Lunch:"
            subtitle={
              menu === undefined
                ? 'Loading...'
                : !hasLunch || !lunchFeatures
                ? 'No lunch served today.'
                : lunchFeatures
                    .split('\n')
                    .map((line, i) => <div key={i}>{line}</div>)
            }
            info={hasLunch ? 'Click to see full menu!' : ''}
            path="/lunch"
            isDarkMode={isDarkMode}
          />
          <InfoCard
            title="Latest Results:"
            subtitle={
              pastResults === undefined
                ? 'Loading...'
                : gameResultsFeature
                    ?.split('\n')
                    .map((line, i) => <div key={i}>{line}</div>) ??
                  'No recent results.'
            }
            info="Click to see other results!"
            path="/sports"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
