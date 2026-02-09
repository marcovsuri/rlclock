import React, { useEffect, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import { getSchedule, Schedule } from '../../core/clockFetcher';

interface ClockProps {
  isDarkMode: boolean;
}

const Clock: React.FC<ClockProps> = ({ isDarkMode }) => {
  const [schedule, setSchedule] = useState<Schedule | null | undefined>(
    undefined,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const result = await getSchedule();
        setSchedule(result.success ? result.data : null);
      } catch (err) {
        console.error('Error fetching schedule:', err);
      }
    };

    fetchSchedule();

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const delay = nextMidnight.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      fetchSchedule();
      setInterval(fetchSchedule, 24 * 60 * 60 * 1000);
    }, delay);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(midnightTimeout);
      clearInterval(interval);
    };
  }, []);

  const parseTime = (timeStr: string): Date => {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  };

  const getCurrentPeriodInfo = (schedule: Schedule) => {
    const now = currentTime;
    const periods = schedule.periods
      .map((p) => {
        if (!p.start || !p.end) return null;
        return {
          ...p,
          startTime: parseTime(p.start),
          endTime: parseTime(p.end),
        };
      })
      .filter(Boolean) as ((typeof schedule.periods)[0] & {
      startTime: Date;
      endTime: Date;
    })[];

    if (periods.length === 0)
      return {
        label: 'No Schedule',
        timeRemaining: null,
        totalDuration: null,
        current: null,
        currentIndex: -1,
      };

    if (now < periods[0].startTime)
      return {
        label: 'Before School',
        timeRemaining: periods[0].startTime.getTime() - now.getTime(),
        totalDuration: null,
        current: null,
        currentIndex: -1,
      };

    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      const next = periods[i + 1];

      if (now >= p.startTime && now <= p.endTime) {
        return {
          label: p.block
            ? `${p.block} Block${p.name ? ` - ${p.name}` : ''}`
            : p.name,
          timeRemaining: p.endTime.getTime() - now.getTime(),
          totalDuration: p.endTime.getTime() - p.startTime.getTime(),
          current: p,
          currentIndex: i,
        };
      }

      if (next && now > p.endTime && now < next.startTime) {
        return {
          label: 'Passing Time',
          timeRemaining: next.startTime.getTime() - now.getTime(),
          totalDuration: next.startTime.getTime() - p.endTime.getTime(),
          current: null,
          currentIndex: i,
        };
      }
    }

    return {
      label: 'After School',
      timeRemaining: null,
      totalDuration: null,
      current: null,
      currentIndex: periods.length,
    };
  };

  const formatCountdown = (ms: number | null) => {
    if (!ms) return null;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const to12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const { label, timeRemaining, totalDuration, current, currentIndex } =
    schedule
      ? getCurrentPeriodInfo(schedule)
      : {
          label: '',
          timeRemaining: null,
          totalDuration: null,
          current: null,
          currentIndex: -1,
        };

  const countdown = formatCountdown(timeRemaining);
  const progressPercent =
    timeRemaining && totalDuration
      ? ((totalDuration - timeRemaining) / totalDuration) * 100
      : 0;

  // Find the next period for preview
  const nextPeriod =
    schedule && currentIndex === -1 && schedule.periods.length > 0
      ? schedule.periods[0]
      : schedule && currentIndex >= 0 && currentIndex < schedule.periods.length - 1
        ? schedule.periods[currentIndex + 1]
        : null;

  const renderContent = () => {
    if (schedule === undefined) return <p style={subtextStyle}>Loading...</p>;
    if (schedule === null) return <p style={subtextStyle}>No School!</p>;

    const maroonText = isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)';
    const maroonBg = isDarkMode ? '#8A1F2E' : 'rgb(154, 31, 54)';
    const neutralBg = isDarkMode ? '#4A4B4D' : '#F2F2F2';
    const neutralText = isDarkMode ? '#9AA0A6' : '#5F6368';
    const normalText = isDarkMode ? '#E8EAED' : '#202124';

    return (
      <>
        {/* Active block - dominant */}
        <div
          style={{
            backgroundColor: maroonBg,
            color: 'white',
            padding: isMobile ? '5vw' : '1.4vw',
            borderRadius: isMobile ? '3vw' : '0.8vw',
            marginBottom: isMobile ? '2vh' : '1.2vw',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: countdown ? (isMobile ? '1.5vh' : '0.6vw') : 0,
            }}
          >
            <span
              style={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: 600,
              }}
            >
              {label}
            </span>
            {countdown && (
              <span
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {countdown}
              </span>
            )}
          </div>
          {/* Progress bar */}
          {(timeRemaining && totalDuration || label === 'Before School') && (
            <div
              style={{
                width: '100%',
                height: isMobile ? '1vh' : '0.35vw',
                backgroundColor: isDarkMode
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.25)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: label === 'Before School' ? '100%' : `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: '999px',
                  transition: 'width 1s linear',
                }}
              />
            </div>
          )}
        </div>

        {/* Next block preview */}
        {nextPeriod && (
          <div
            style={{
              backgroundColor: neutralBg,
              padding: isMobile ? '3vw' : '0.8vw',
              borderRadius: isMobile ? '2vw' : '0.6vw',
              marginBottom: isMobile ? '2vh' : '1.2vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 16,
              color: normalText,
            }}
          >
            <span style={{ fontWeight: 500 }}>
              Next:{' '}
              {nextPeriod.block
                ? nextPeriod.name
                  ? `${nextPeriod.block} Block - ${nextPeriod.name}`
                  : `${nextPeriod.block} Block`
                : nextPeriod.name}
            </span>
            <span>
              {to12HourFormat(nextPeriod.start)} -{' '}
              {to12HourFormat(nextPeriod.end)}
            </span>
          </div>
        )}

        {/* Collapsed/expanded schedule */}
        {showFullSchedule && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '0.8vh' : '0.4vw',
              marginBottom: isMobile ? '1.5vh' : '0.8vw',
            }}
          >
            {schedule.periods.map((period, idx) => {
              const isCurrent =
                current?.name === period.name &&
                current?.start === period.start;
              const isPast = idx < currentIndex;
              const isFuture = !isCurrent && !isPast;

              return (
                <div
                  key={idx}
                  style={{
                    padding: isMobile ? '2vw' : '0.5vw 0.8vw',
                    borderRadius: isMobile ? '2vw' : '0.5vw',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: isCurrent ? 600 : 400,
                    fontSize: isMobile ? 13 : 14,
                    backgroundColor: isCurrent
                      ? maroonBg
                      : isFuture
                        ? neutralBg
                        : 'transparent',
                    color: isCurrent
                      ? 'white'
                      : isPast
                        ? neutralText
                        : normalText,
                    textAlign: 'left',
                  }}
                >
                  <span>
                    {period.block
                      ? period.name
                        ? `${period.block} Block - ${period.name}`
                        : `${period.block} Block`
                      : period.name}
                  </span>
                  <span>
                    {to12HourFormat(period.start)} -{' '}
                    {to12HourFormat(period.end)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFullSchedule(!showFullSchedule);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: maroonText,
            cursor: 'pointer',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
            padding: isMobile ? '1vw' : '0.3vw',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3em',
            margin: '0 auto',
          }}
        >
          {showFullSchedule ? 'Hide schedule' : 'View full schedule'}
          <span
            style={{
              display: 'inline-block',
              transform: showFullSchedule ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            ›
          </span>
        </button>
      </>
    );
  };

  const subtextStyle: React.CSSProperties = {
    fontWeight: 500,
    color: isDarkMode ? '#E8EAED' : '#202124',
    fontSize: isMobile ? 20 : 24,
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        padding: isMobile ? '4vw' : '1.5vw',
        borderRadius: isMobile ? '4vw' : '1.2vw',
        boxShadow: isDarkMode
          ? '0 2px 12px rgba(0,0,0,0.5)'
          : '0 2px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: isMobile ? '93vw' : '40vw',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Current time */}
      <div
        style={{
          fontSize: isMobile ? 14 : 14,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          marginBottom: isMobile ? '0.5vh' : '0.3vw',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {(() => {
          const h = currentTime.getHours();
          const m = currentTime.getMinutes();
          const hour12 = h % 12 === 0 ? 12 : h % 12;
          const ampm = h >= 12 ? 'PM' : 'AM';
          const colonVisible = currentTime.getSeconds() % 2 === 0;
          const dateStr = currentTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          return (
            <>
              {dateStr} - {hour12}
              <span style={{ opacity: colonVisible ? 1 : 0 }}>:</span>
              {m.toString().padStart(2, '0')} {ampm}
            </>
          );
        })()}
      </div>
      <h2
        style={{
          marginBottom: isMobile ? '1.5vh' : '0.8vw',
          marginTop: 0,
          fontSize: isMobile ? 32 : 48,
          color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
          fontWeight: 700,
        }}
      >
        RL Clock
      </h2>
      {renderContent()}
    </div>
  );
};

export default Clock;
