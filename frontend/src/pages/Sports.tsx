import React, { useState, useEffect, useMemo } from 'react';
import ResultsCard from '../components/sports/ResultsCard';
import useIsMobile from '../hooks/useIsMobile';
import TodayGamesCard from '../components/sports/TodayGamesCard';
import { motion } from 'framer-motion';
import { TeamEvent } from '../types/sports';
import getSportsEvents from '../core/sportsFetcher';
import getUpcomingSportsEvents from '../core/upcomingSportsFetcher';
import { UpcomingEvent } from '../types/upcomingSports';

interface SportsProps {
  isDarkMode: boolean;
}

type TeamRecord = { wins: number; losses: number; ties: number };

const Sports: React.FC<SportsProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();
  const [pastGames, setPastGames] = useState<TeamEvent[] | undefined | null>(
    undefined
  );

  const [upcomingGames, setUpcomingGames] = useState<
    UpcomingEvent[] | undefined | null
  >(undefined);

  const records = useMemo(() => {
    if (!pastGames) return null;
    const map = new Map<string, TeamRecord>();
    for (const event of pastGames) {
      for (let i = 0; i < event.opponents.length; i++) {
        const raw = event.scores?.[i] ? String(event.scores[i]) : '';
        const [a, b] = raw.split(/-+/).map(Number);
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;

        const team = event.team.replace(/&amp;/g, '&');
        if (!map.has(team)) map.set(team, { wins: 0, losses: 0, ties: 0 });
        const rec = map.get(team)!;
        if (a === b) rec.ties++;
        else if (event.wins[i]) rec.wins++;
        else rec.losses++;
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [pastGames]);

  useEffect(() => {
    document.title = 'RL Clock | Sports';
    getSportsEvents().then((response) => {
      if (response.success) {
        const games = response.data.slice(0, 50);
        setPastGames(games.length > 0 ? games : null);
      } else {
        setPastGames(null);
      }
    });
  }, []);

  useEffect(() => {
    getUpcomingSportsEvents().then((response) => {
      if (response.success) {
        const today = new Date();
        const todayMD = `${today.getMonth() + 1}/${today.getDate()}`;
        setUpcomingGames(
          response.data.filter((e) => e.date.startsWith(todayMD))
        );
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
        width: '100%',
      }}
    >
      <div
        style={{
          width: isMobile ? '92vw' : '40vw',
          margin: isMobile ? '3vh auto' : '3vh auto',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '2vw' : '1vw',
        }}
      >
        <TodayGamesCard
          todayGames={upcomingGames}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />

        {records && records.length > 0 && (
          <div
            style={{
              backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
              borderRadius: isMobile ? '3vw' : '0.8vw',
              boxShadow: isDarkMode
                ? '0 2px 12px rgba(0,0,0,0.5)'
                : '0 2px 12px rgba(0,0,0,0.1)',
              padding: isMobile ? '3vw' : '1.2vw',
              width: '100%',
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? '3.5vw' : '0.85vw',
                margin: 0,
                marginBottom: isMobile ? '2vw' : '0.8vw',
                color: isDarkMode ? '#9AA0A6' : '#5F6368',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Team Records
            </h3>
            {/* Column headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: isMobile ? '2vw' : '0.6vw',
                padding: isMobile ? '0 2vw 1vw' : '0 0.6vw 0.3vw',
                fontSize: isMobile ? '2.8vw' : '0.7vw',
                fontWeight: 600,
                color: isDarkMode ? '#9AA0A6' : '#5F6368',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span />
              <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw' }}>W</span>
              <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw' }}>L</span>
              <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw' }}>T</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '1vw' : '0.25vw',
              }}
            >
              {records.map(([team, rec]) => (
                <div
                  key={team}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    gap: isMobile ? '2vw' : '0.6vw',
                    alignItems: 'center',
                    padding: isMobile ? '1.5vw 2vw' : '0.35vw 0.6vw',
                    fontSize: isMobile ? '3.5vw' : '0.95vw',
                    fontWeight: 500,
                    color: isDarkMode ? '#E8EAED' : '#202124',
                  }}
                >
                  <span>{team}</span>
                  <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw', color: isDarkMode ? '#4ade80' : '#16a34a' }}>{rec.wins}</span>
                  <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw', color: isDarkMode ? '#9AA0A6' : '#5F6368' }}>{rec.losses}</span>
                  <span style={{ textAlign: 'center', minWidth: isMobile ? '8vw' : '2.5vw', color: isDarkMode ? '#9AA0A6' : '#5F6368' }}>{rec.ties}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ResultsCard
          results={pastGames}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
      </div>
    </motion.div>
  );
};

export default Sports;
