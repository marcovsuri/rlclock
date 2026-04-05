import React, { useEffect, useState } from 'react';
import type { Schedule } from '~/types/clock';
import ScheduleComponent from './ScheduleComponent';
import { getClockStampInfo, getClockStatusInfo } from '~/utils/clock/utils';
import { getUserData } from '~/core/AuthHandler';

interface Props {
  schedule: Schedule | null;
  isMobile: boolean;
  isDark: boolean;
}

const createStyles = (isMobile: boolean, isDark: boolean) => {
  const container: React.CSSProperties = {
    width: '100%',
    backgroundColor: isDark ? '#2D2E30' : '#FFFFFF',
    padding: isMobile ? '1.4rem 1rem 1.25rem' : '1.5vw',
    borderRadius: isMobile ? '1.45rem' : '1.2vw',
    boxShadow: isDark
      ? '0 2px 12px rgba(0, 0, 0, 0.5)'
      : '0 2px 12px rgba(0, 0, 0, 0.12)',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  const stamp: React.CSSProperties = {
    fontSize: '14px',
    color: isDark ? '#B0B5BA' : '#5F6368',
    marginBottom: isMobile ? '0.5rem' : '0.3vw',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  };

  const title: React.CSSProperties = {
    marginTop: 0,
    marginBottom: isMobile ? '0.75rem' : '0.8vw',
    fontSize: isMobile ? '32px' : '48px',
    color: '#B0263E',
    fontWeight: 700,
  };

  const accentBar: React.CSSProperties = {
    width: '3em',
    height: '3px',
    backgroundColor: '#B0263E',
    margin: isMobile ? '0 auto 1rem' : '0 auto 0.8vw',
    borderRadius: '2px',
    opacity: 0.6,
  };

  const statusCard: React.CSSProperties = {
    backgroundColor: isDark ? '#8A1F2E' : '#B0263E',
    color: '#FFFFFF',
    padding: isMobile ? '1.2rem' : '1.4vw',
    borderRadius: isMobile ? '1.15rem' : '0.8vw',
    marginBottom: isMobile ? '1.15rem' : '1.2vw',
  };

  const statusLabel: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: isMobile ? '0.9rem' : '1.1vw',
  };

  const statusTitle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    textAlign: 'left',
    lineHeight: 1.2,
    flex: 1,
  };

  const statusCountdown: React.CSSProperties = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  };

  const progressTrack: React.CSSProperties = {
    width: '100%',
    height: isMobile ? '0.5rem' : '0.35vw',
    backgroundColor: isDark
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(255,255,255,0.25)',
    borderRadius: '999px',
    overflow: 'hidden',
  };

  const progressFill: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '999px',
    transition: 'width 1s linear',
  };

  const emptyState: React.CSSProperties = {
    fontSize: '16px',
    color: isDark ? '#B0B5BA' : '#5F6368',
  };

  return {
    container,
    stamp,
    title,
    accentBar,
    statusCard,
    statusLabel,
    statusTitle,
    statusCountdown,
    progressTrack,
    progressFill,
    emptyState,
  };
};

const Clock: React.FC<Props> = ({ schedule, isMobile, isDark }) => {
  const styles = createStyles(isMobile, isDark);
  const [now, setNow] = useState(new Date(Date.now()));
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date(Date.now())), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const user = getUserData();
    console.log('Fetched user data:', user);
    setUserFirstName(user?.first_name ?? null);
  }, []);

  const { dateLabel, hour, minute, dayPeriod, blinkOpacity } =
    getClockStampInfo(now);
  const {
    clockDisplayInfo,
    clockStatus,
    countdown,
    progressWidth,
    showProgress,
  } = getClockStatusInfo(now, schedule);

  return (
    <div style={styles.container}>
      <div style={styles.stamp}>
        {dateLabel} - {hour}
        <span style={{ opacity: blinkOpacity }}>:</span>
        {minute} {dayPeriod}
      </div>
      <h2 style={styles.title}>
        {userFirstName ? `${userFirstName}'s ` : ''}RL Clock
      </h2>
      <div style={styles.accentBar} />

      <div style={styles.statusCard}>
        <div
          style={{
            ...styles.statusLabel,
            marginBottom: showProgress ? (isMobile ? '0.75rem' : '0.6vw') : 0,
          }}
        >
          <div style={styles.statusTitle}>{clockStatus}</div>
          {countdown ? (
            <div style={styles.statusCountdown}>{countdown}</div>
          ) : null}
        </div>
        {showProgress ? (
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: progressWidth ?? undefined,
              }}
            />
          </div>
        ) : null}
      </div>

      {schedule && clockDisplayInfo ? (
        <ScheduleComponent
          clockDisplayInfo={clockDisplayInfo}
          schedule={schedule}
          isMobile={isMobile}
          isDark={isDark}
        />
      ) : (
        <div style={styles.emptyState}>No schedule available today.</div>
      )}
    </div>
  );
};

export default Clock;
