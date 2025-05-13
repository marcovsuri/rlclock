import React, { useEffect, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import { getSchedule, Schedule } from '../../core/clockFetcher';

interface ClockProps {
  isDarkMode: boolean;
}

const Clock: React.FC<ClockProps> = ({ isDarkMode }) => {
  const [schedule, setSchedule] = useState<Schedule | null | undefined>(
    undefined
  );
  const [currentTime, setCurrentTime] = useState(new Date());
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
      now.getDate() + 1
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
      return { label: 'No Schedule', timeRemaining: null, current: null };

    if (now < periods[0].startTime)
      return {
        label: 'Before School',
        timeRemaining: periods[0].startTime.getTime() - now.getTime(),
        current: null,
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
          current: p,
        };
      }

      if (next && now > p.endTime && now < next.startTime) {
        return {
          label: 'Passing Time',
          timeRemaining: next.startTime.getTime() - now.getTime(),
          current: null,
        };
      }
    }

    return { label: 'After School', timeRemaining: null, current: null };
  };

  const formatTimeRemaining = (ms: number | null) => {
    if (!ms) return null;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} min ${sec.toString().padStart(2, '0')} sec remaining`;
  };

  const to12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const { label, timeRemaining, current } = schedule
    ? getCurrentPeriodInfo(schedule)
    : { label: '', timeRemaining: null, current: null };

  const formattedTime = formatTimeRemaining(timeRemaining);

  const renderContent = () => {
    if (schedule === undefined) return 'Loading...';
    if (schedule === null) return 'No School!';
    return (
      <>
        <p style={textStyle(isMobile, isDarkMode)}>{label}</p>
        {formattedTime && (
          <p style={textStyle(isMobile, isDarkMode)}>{formattedTime}</p>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1.5vh' : '1vh',
          }}
        >
          {schedule.periods.map((period, idx) => {
            const isCurrent =
              current?.name === period.name && current?.start === period.start;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isCurrent
                    ? 'rgba(154, 31, 54, 0.25)'
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(154, 31, 54, 0.1)',
                  padding: isMobile ? '3vw' : '1vw',
                  borderRadius: isMobile ? '3vw' : '1vw',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 500,
                  fontSize: isMobile ? '4vw' : '1vw',
                  color: isCurrent ? '#9a1f36' : isDarkMode ? 'white' : 'black',
                  border: isCurrent ? '2px solid #9a1f36' : 'none',
                  textAlign: 'left',
                }}
              >
                <span style={{ textAlign: 'left' }}>
                  {period.block
                    ? period.name
                      ? `${period.block} Block - ${period.name}`
                      : `${period.block} Block`
                    : period.name}
                </span>
                <span style={{ textAlign: 'right' }}>
                  {to12HourFormat(period.start)} - {to12HourFormat(period.end)}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <Card isMobile={isMobile} isDarkMode={isDarkMode}>
      <h2 style={headerStyle(isMobile)}>RL Clock</h2>
      {renderContent()}
    </Card>
  );
};

export default Clock;

// ------------------- Subcomponents & Styles -------------------

const Card: React.FC<{
  isMobile: boolean;
  isDarkMode: boolean;
  children: React.ReactNode;
}> = ({ isMobile, isDarkMode, children }) => (
  <div
    style={{
      backgroundColor: isDarkMode ? 'black' : 'white',
      padding: isMobile ? '4vw' : '1.5vw',
      borderRadius: isMobile ? '5vw' : '2vw',
      boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
      textAlign: 'center',
      color: 'rgb(154, 31, 54)',
      width: isMobile ? '93vw' : '40vw',
      margin: '0vh auto',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

const headerStyle = (isMobile: boolean) => ({
  marginBottom: '1vh',
  fontSize: isMobile ? '5vh' : '3vw',
});

const textStyle = (isMobile: boolean, isDarkMode: boolean) => ({
  fontWeight: 500,
  color: isDarkMode ? 'white' : 'black',
  fontSize: isMobile ? '4vw' : '1.5vw',
  marginBottom: '2vh',
});
