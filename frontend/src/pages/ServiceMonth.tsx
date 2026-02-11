import React, { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import ProgressBar from '../components/service/ProgressBar';
import {
  getServiceMonthCounter,
  getServiceMonthLeaderboardData,
  SheetData,
} from '../core/serviceMonthDataFetcher';
import BackButton from '../components/global/BackButton';

interface ServiceProps {
  isDarkMode: boolean;
}

const ServiceMonth: React.FC<ServiceProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  const [leaderboardData, setLeaderboardData] = useState<SheetData[]>([]);
  const DONATION_GOAL = 7500;
  const [donationCounter, setDonationCounter] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  type SortKey = 'class' | 'participation' | 'points';
  const [sortKey, setSortKey] = useState<SortKey>('points');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'class'); // default asc for class, desc for numbers
    }
  };

  useEffect(() => {
    document.title = 'RL Clock | Service';

    const loadData = async () => {
      const leaderboardResult = await getServiceMonthLeaderboardData();
      if (leaderboardResult.success) {
        setLeaderboardData(leaderboardResult.data);
      }

      const counterResult = await getServiceMonthCounter();
      if (counterResult.success) {
        setDonationCounter(counterResult.data);
      }
    };

    loadData();

    const end = new Date(2026, 1, 20, 23, 59, 59); // Feb 20, 2026
    const updateCountdown = () => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      setDaysLeft(diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedData = leaderboardData.slice().sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === 'class') return dir * a.class.localeCompare(b.class);
    if (sortKey === 'participation')
      return dir * (a.participationPercentage - b.participationPercentage);
    return dir * (a.points - b.points);
  });

  const topParticipation =
    leaderboardData.length > 0
      ? leaderboardData.reduce((prev, cur) =>
          cur.participationPercentage > prev.participationPercentage
            ? cur
            : prev,
        ).class
      : '';

  const topPoints =
    leaderboardData.length > 0
      ? leaderboardData.reduce((prev, cur) =>
          cur.points > prev.points ? cur : prev,
        ).class
      : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        padding: isMobile ? '3vh 2vw' : '3vh 4vw',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: isMobile ? '92vw' : '40vw',
          textAlign: 'left',
          marginTop: 8,
        }}
      >
        <BackButton isDarkMode={isDarkMode} />
      </div>
      {/* Title */}
      <h1
        style={{
          fontSize: isMobile ? 32 : 48,
          fontWeight: 700,
          color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
          marginBottom: isMobile ? '1vh' : '0.5vw',
          marginTop: isMobile ? '3vh' : '2vh',
          textAlign: 'center',
        }}
      >
        Service Month
      </h1>

      {/* Countdown */}
      {daysLeft !== null && (
        <p
          style={{
            fontSize: 16,
            color: isDarkMode ? '#9AA0A6' : '#5F6368',
            marginBottom: isMobile ? '2vh' : '1vw',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {daysLeft === 0
            ? 'Service drive ends today!'
            : `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`}
        </p>
      )}

      {/* Progress Bar */}
      <ProgressBar
        donationGoal={DONATION_GOAL}
        numDonations={donationCounter || 0}
        isDarkMode={isDarkMode}
      />

      {/* Combined Leaderboard Table */}
      {sortedData.length > 0 && (
        <div
          style={{
            marginTop: isMobile ? '3vh' : '2vw',
            width: isMobile ? '92vw' : '40vw',
            backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
            borderRadius: isMobile ? '3vw' : '0.8vw',
            boxShadow: isDarkMode
              ? '0 2px 12px rgba(0,0,0,0.5)'
              : '0 2px 12px rgba(0,0,0,0.1)',
            padding: isMobile ? '3vw' : '1.2vw',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.3fr 1fr 1fr 1fr',
              gap: isMobile ? '1vw' : '0.5vw',
              padding: isMobile ? '1.5vw 2vw' : '0.3vw 0.6vw',
              fontSize: isMobile ? 13 : 14,
              fontWeight: 600,
              color: isDarkMode ? '#9AA0A6' : '#5F6368',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: isDarkMode
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(0,0,0,0.06)',
              marginBottom: isMobile ? '1vw' : '0.3vw',
              paddingBottom: isMobile ? '1.5vw' : '0.4vw',
            }}
          >
            <span>#</span>
            <span
              onClick={() => handleSort('class')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Class {sortKey === 'class' ? (sortAsc ? '↑' : '↓') : ''}
            </span>
            <span
              onClick={() => handleSort('participation')}
              style={{
                textAlign: 'right',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              Participation{' '}
              {sortKey === 'participation' ? (sortAsc ? '↑' : '↓') : ''}
            </span>
            <span
              onClick={() => handleSort('points')}
              style={{
                textAlign: 'right',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              Points {sortKey === 'points' ? (sortAsc ? '↑' : '↓') : ''}
            </span>
          </div>

          {/* Rows */}
          {sortedData.map(
            ({ class: className, participationPercentage, points }, i) => {
              const isPointsLeader = className === topPoints;
              const isParticipationLeader = className === topParticipation;

              return (
                <div
                  key={className}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '0.3fr 1fr 1fr 1fr',
                    gap: isMobile ? '1vw' : '0.5vw',
                    alignItems: 'center',
                    fontSize: 16,
                    fontWeight: isPointsLeader ? 600 : 500,
                    color: isDarkMode ? '#E8EAED' : '#202124',
                    backgroundColor: isPointsLeader
                      ? isDarkMode
                        ? 'rgba(138,31,46,0.2)'
                        : 'rgba(154,31,54,0.06)'
                      : 'transparent',
                    borderLeft: isPointsLeader
                      ? `3px solid ${isDarkMode ? '#C43C5A' : 'rgb(154,31,54)'}`
                      : '3px solid transparent',
                    opacity: 1,
                  }}
                >
                  {/* Rank */}
                  <span
                    style={{
                      color: isDarkMode ? '#9AA0A6' : '#5F6368',
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Class name */}
                  <span>{className}</span>

                  {/* Participation % */}
                  <span
                    style={{
                      textAlign: 'right',
                      fontWeight: isParticipationLeader ? 700 : 500,
                      color: isParticipationLeader
                        ? isDarkMode
                          ? '#C43C5A'
                          : 'rgb(154,31,54)'
                        : isDarkMode
                          ? '#9AA0A6'
                          : '#5F6368',
                    }}
                  >
                    {participationPercentage}%
                  </span>

                  {/* Points */}
                  <span
                    style={{
                      textAlign: 'right',
                      color: isDarkMode
                        ? 'rgba(255,255,255,0.7)'
                        : 'rgba(0,0,0,0.6)',
                    }}
                  >
                    {points}
                  </span>
                </div>
              );
            },
          )}

          {/* Sort indicator */}
          <div
            style={{
              marginTop: isMobile ? '2vw' : '0.5vw',
              fontSize: isMobile ? 13 : 14,
              color: isDarkMode ? '#9AA0A6' : '#5F6368',
              textAlign: 'right',
              paddingRight: isMobile ? '2vw' : '0.6vw',
            }}
          >
            Sorted by {sortKey} ({sortAsc ? 'asc' : 'desc'})
          </div>
        </div>
      )}
      <img
        alt="Service Month"
        src="/2026-service-month.jpg"
        style={{
          marginTop: isMobile ? '3vh' : '2vw',
          width: isMobile ? '92vw' : '40vw',
          boxShadow: isDarkMode
            ? '0 2px 12px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          borderRadius: isMobile ? '3vw' : '0.8vw',
        }}
      />
    </div>
  );
};

export default ServiceMonth;
