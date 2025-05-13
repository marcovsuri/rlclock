import React, { useState, useEffect } from 'react';
import BackButton from '../components/home/BackButton';
import ResultsCard from '../components/sports/ResultsCard';
import StatsCard from '../components/sports/StatsCard';
import useIsMobile from '../hooks/useIsMobile';
import TodayGamesCard from '../components/sports/TodayGamesCard';
import { motion } from 'framer-motion';
import { TeamEvent } from '../types/sports';
import getSportsEvents from '../core/sportsFetcher';
import getUpcomingSportsEvents from '../core/upcomingSportsFetcher';
import { UpcomingEvent } from '../types/upcomingSports';
import Footer from '../components/home/Footer';

const Sports = () => {
  const isMobile = useIsMobile();
  const [pastGames, setPastGames] = useState<TeamEvent[] | undefined | null>(
    undefined
  );

  const [upcomingGames, setUpcomingGames] = useState<
    UpcomingEvent[] | undefined | null
  >(undefined);

  useEffect(() => {
    document.title = 'RL Clock | Sports';
    getSportsEvents().then((response) => {
      if (response.success) {
        setPastGames(response.data.slice(0, 100));
      } else {
        setPastGames(null);
      }
    });
  }, []);

  useEffect(() => {
    getUpcomingSportsEvents().then((response) => {
      if (response.success) {
        const today = new Date();
        const todayString = `${
          today.getMonth() + 1
        }/${today.getDate()}/${today.getFullYear()}`;

        setUpcomingGames(response.data.filter((e) => e.date === todayString));
      } else {
        setUpcomingGames(null);
      }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {/* OUTER CONTAINER for center layout */}
      <div
        style={{
          width: isMobile ? '90vw' : '60vw',
          margin: '5vh auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Back Button manually aligned left */}
        <div style={{ margin: '5vh auto' }}>
          <BackButton />
        </div>

        {/* Today's Games Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TodayGamesCard todayGames={upcomingGames} isMobile={isMobile} />
        </div>

        {/* Bottom Row: Results + Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2vw',
            marginTop: '3vh',
            height: isMobile ? 'auto' : '40vh',
            width: '90%',
            margin: '2vh auto',
            marginBottom: '0vh',
          }}
        >
          <ResultsCard results={pastGames} isMobile={isMobile} />
          {/* <StatsCard stats={stats} isMobile={isMobile} /> */}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Sports;
