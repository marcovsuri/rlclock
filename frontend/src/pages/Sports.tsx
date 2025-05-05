import React from 'react';
import BackButton from '../components/home/BackButton';
import ResultsCard from '../components/sports/ResultsCard';
import StatsCard from '../components/sports/StatsCard'; // Make sure this exists
import useIsMobile from '../hooks/useIsMobile';
import TodayGamesCard from '../components/sports/TodayGamesCard';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const mockUpcomingGames = [
  { time: '2025-05-01T14:00', team: 'Varsity Baseball vs Newton South' },
  { time: '2025-05-01T17:00', team: 'Girls Lacrosse @ Wellesley' },
];

const mockPastResults = [
  { date: '2025-04-30', result: 'Boys Tennis defeated Weston 4-1' },
  { date: '2025-04-29', result: 'Girls Track lost to Brookline 60-70' },
  { date: '2025-04-28', result: 'Varsity Baseball beat Needham 5-2' },
  { date: '2025-04-27', result: 'Boys Lacrosse beat Newton North 9-8' },
  { date: '2025-04-26', result: 'Softball lost to Brookline 2-6' },
];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const calculateStats = () => {
  const totalGames = mockPastResults.length;
  const wins = mockPastResults.filter(
    (r) =>
      r.result.toLowerCase().includes('beat') ||
      r.result.toLowerCase().includes('defeated')
  ).length;
  const losses = totalGames - wins;
  const winPercent =
    totalGames === 0 ? 0 : ((wins / totalGames) * 100).toFixed(1);
  return { totalGames, wins, losses, winPercent };
};

const Sports = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = 'RL Clock | Lunch';
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const todayGames = mockUpcomingGames;
  //   .filter((game) => game.time.startsWith(today))
  //   .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const stats = {
    totalGames: 10,
    wins: 6,
    losses: 4,
    winPercent: (6 / 10) * 100,
  };

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
      <div
        style={{
          padding: isMobile ? '4vw' : '2vw',
          width: isMobile ? '90vw' : '60vw',
          margin: '2vh auto',
          boxSizing: 'border-box',
        }}
      >
        <BackButton />
        {/* Today's Games */}
        <TodayGamesCard
          todayGames={todayGames}
          isMobile={isMobile}
          formatTime={formatTime}
        />{' '}
        {/* Bottom Row: Results + Stats */}
        <div
          style={{
            display: isMobile ? 'block' : 'flex',
            justifyContent: 'space-between',
            gap: '2vw',
            height: '40vh',
          }}
        >
          <ResultsCard results={mockPastResults} isMobile={isMobile} />
          <StatsCard stats={stats} isMobile={isMobile} />
        </div>
      </div>
    </motion.div>
  );
};

export default Sports;
