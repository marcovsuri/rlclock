import React, { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import ProgressBar from '../components/service/ProgressBar';
import { z } from 'zod';
import {
  getServiceMonthCounter,
  getServiceMonthLeaderboardData,
  SheetData,
} from '../core/serviceMonthDataFetcher';

interface ServiceProps {
  isDarkMode: boolean;
}

const ServiceMonth: React.FC<ServiceProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  const [leaderboardData, setLeaderboardData] = useState<SheetData[]>([]);
  const DONATION_GOAL = 7500;
  const [donationCounter, setDonationCounter] = useState<number>(0);

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
  }, []);

  const bubbleStyle: React.CSSProperties = {
    borderRadius: '12px',
    padding: isMobile ? '3vw' : '1.5vw',
    marginBottom: isMobile ? '3vw' : '1vw',
    boxShadow: isDarkMode
      ? '0 4px 8px rgba(154,31,54,0.6)'
      : '0 4px 8px rgba(154,31,54,0.3)',
    backgroundColor: isDarkMode ? 'rgba(154,31,54,0.2)' : 'rgba(154,31,54,0.1)',
    border:
      '1px solid ' +
      (isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'),
    color: isDarkMode ? '#f0f0f0' : '#222',
    fontSize: isMobile ? '4vw' : '1.2vw',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100vw',
        padding: isMobile ? '4vh 2vw' : '4vh 4vw',
        boxSizing: 'border-box',
        backgroundColor: isDarkMode ? 'black' : 'white',
      }}
    >
      {/* Title Banner */}
      <h1
        style={{
          fontSize: isMobile ? 32 : 48,
          fontWeight: 700,
          color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
          marginBottom: isMobile ? '1vh' : '0.5vw',
          marginTop: isMobile ? '3vh' : '2vh',
          textAlign: 'center',
          marginTop: isMobile ? '4vh' : '6vh',
        }}
      >
        🤝 Service Month! 🎯
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
        numDonations={donationCounter || 0} // This would be dynamic in a real app
        isDarkMode={isDarkMode}
      />

      {/* Leaderboards: Participation & Points */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4vh' : '2vw',
          marginTop: '4vh',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Participation Leaderboard */}
        <div
          style={{
            flex: 1,
            maxWidth: isMobile ? '90vw' : '28vw',
            overflowX: 'hidden',
            backgroundColor: isDarkMode ? 'rgb(15,0,0)' : 'rgb(255,240,240)',
            border: `2px solid ${
              isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'
            }`,
            borderRadius: '16px',
            padding: isMobile ? '4vw' : '2vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
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
              style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
            >
              Participation {sortKey === 'participation' ? (sortAsc ? '↑' : '↓') : ''}
            </span>
            <span
              onClick={() => handleSort('points')}
              style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
            >
              Points {sortKey === 'points' ? (sortAsc ? '↑' : '↓') : ''}
            </span>
          </div>

          {/* Rows */}
          {sortedData.map(({ class: className, participationPercentage, points }, i) => {
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
                  padding: isMobile ? '2vw' : '0.4vw 0.6vw',
                  borderRadius: isMobile ? '2vw' : '0.4vw',
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
                  <span>Class {className}</span>
                  <span>{participationPercentage}%</span>
                </div>
              );
            })}
        </div>

        {/* Points Leaderboard */}
        <div
          style={{
            flex: 1,
            maxWidth: isMobile ? '90vw' : '28vw',
            overflowX: 'hidden',
            backgroundColor: isDarkMode ? 'rgb(15,0,0)' : 'rgb(255,240,240)',
            border: `2px solid ${
              isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'
            }`,
            borderRadius: '16px',
            padding: isMobile ? '4vw' : '2vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '6vw' : '2vw',
              marginBottom: '2vh',
              textAlign: 'center',
              color: 'rgb(154, 31, 54)',
            }}
          >
            🍕 Total Points
          </h2>
          {leaderboardData
            .slice()
            .sort((a, b) => b.points - a.points)
            .slice(0, 6)
            .map(({ class: className, points }, i, arr) => {
              const opacity = 1 - (i * (1 - 0.2)) / (arr.length - 1);
              return (
                <div
                  key={i}
                  style={{
                    ...bubbleStyle,
                    opacity,
                    transform: i === 0 ? 'scale(1.05)' : 'scale(1)',
                    boxShadow:
                      i === 0
                        ? isDarkMode
                          ? '0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,215,0,0.6)'
                          : '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)'
                        : bubbleStyle.boxShadow,
                    border: i === 0 ? '2px solid gold' : bubbleStyle.border,
                    backgroundColor:
                      i === 0
                        ? isDarkMode
                          ? 'rgba(255,215,0,0.15)'
                          : 'rgba(255,215,0,0.25)'
                        : bubbleStyle.backgroundColor,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <span>Class {className}</span>
                  <span>{points} points</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Instructions / Blurb */}
      <div
        style={{
          marginTop: '4vh',
          maxWidth: isMobile ? '90vw' : '60vw',
          fontSize: isMobile ? '4vw' : '1.2vw',
          lineHeight: 1.6,
          color: isDarkMode ? '#f0f0f0' : '#222',
          textAlign: 'left',
          backgroundColor: isDarkMode ? 'rgb(15, 0, 0)' : 'rgb(255, 240, 240)',
          border: `2px solid ${
            isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'
          }`,
          borderRadius: '16px',
          padding: isMobile ? '4vw' : '2vw',
          // boxShadow: '0 8px 24px rgba(154,31,54,0.3)',
        }}
      >
        <img
          src="/2026-service-month.jpg"
          alt="Service Month"
          style={{ width: '100%', borderRadius: '12px' }}
        />
      </div>

      {/* Video of the Week */}
      <div
        style={{
          marginTop: '4vh',
          maxWidth: isMobile ? '90vw' : '60vw',
          width: '100%',
          backgroundColor: isDarkMode ? 'rgb(15, 0, 0)' : 'rgb(255, 240, 240)',
          border: `2px solid ${
            isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'
          }`,
          borderRadius: '16px',
          padding: isMobile ? '4vw' : '2vw',
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? '5vw' : '1.8vw',
            marginBottom: '2vh',
            textAlign: 'center',
            color: 'rgb(154, 31, 54)',
          }}
        >
          🎥 Video of the Week
        </h2>

        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/7UnKdfSW4Rw"
            title="Video of the Week"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              marginTop: isMobile ? '2vw' : '0.5vw',
              fontSize: isMobile ? 13 : 14,
              color: isDarkMode ? '#9AA0A6' : '#5F6368',
              textAlign: 'right',
              paddingRight: isMobile ? '2vw' : '0.6vw',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceMonth;
