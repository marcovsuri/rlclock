import React from 'react';
import { motion } from 'framer-motion';
import Clock from '../components/home/Clock';
import InfoCard from '../components/home/InfoCard';
import useIsMobile from '../hooks/useIsMobile';
import { useEffect, useState } from 'react';
import getMenu from '../core/lunchFetcher';
import { Menu } from '../types/lunch';
import Footer from '../components/home/Footer';

const Home: React.FC = () => {
  const isMobile = useIsMobile();

  const [menu, setMenu] = useState<Menu | undefined>(undefined);

  useEffect(() => {
    getMenu().then((result) => {
      if (result.success) {
        setMenu(result.data);
      }
    });
  }, []);

  const lunchFeature = menu?.Entrées?.[0]?.name;

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
    width: isMobile ? '100%' : '30vw',
    padding: '1vw',
    boxSizing: 'border-box',
  };

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
          <Clock />
        </div>
        <div style={cardsStyle}>
          <InfoCard
            title="Today's Lunch:"
            subtitle={
              menu === undefined
                ? 'Loading...'
                : lunchFeature ?? 'No lunch today.'
            }
            info="Click to see full menu!"
            path="/lunch"
          />
          <InfoCard
            title="Latest Results:"
            subtitle={`Varsity Tennis 6-0 Win
                Varsity Baseball 11-3 Win
                Varsity Lacrosse 9-8 Win
                Varsity Track 3-0 Win`}
            info="Click to see other results!"
            path="/sports"
          />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Home;
