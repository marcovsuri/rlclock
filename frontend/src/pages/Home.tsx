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
import ServiceDriveCard from '../components/home/ServiceDriveCard';
import getServiceData from '../core/serviceDataFetcher';
import { ServiceData } from '../types/serviceData';
import { getSchedule, Schedule } from '../core/clockFetcher';
import { Link } from 'react-router-dom';

interface HomeProps {
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  const [menu, setMenu] = useState<Menu | undefined>(undefined);
  const [pastResults, setPastResults] = useState<
    TeamEvent[] | undefined | null
  >(undefined);

  const [serviceData, setServiceData] = useState<ServiceData | undefined>(
    undefined
  );

  useEffect(() => {
    getServiceData().then((result) => {
      if (result.success) {
        setServiceData(result.data);
      }
    });
  }, []);

  useEffect(() => {
    getMenu().then((result) => {
      if (result.success) {
        setMenu(result.data);
      }
    });
  }, []);

  useEffect(() => {
    const normalizeDate = (md: string): Date => {
      const [month, day] = md.split('/').map(Number);
      const now = new Date();
      const year =
        now.getMonth() + 1 >= 8 ? now.getFullYear() : now.getFullYear() - 1;
      return new Date(year, month - 1, day);
    };
    getSportsEvents().then((response) => {
      if (response.success) {
        const firstDayOfSchool = new Date('8/25/2025');
        const results = response.data
          .slice(0, 4)
          .filter((e) => normalizeDate(e.date) > firstDayOfSchool);

        setPastResults(results);
      } else {
        setPastResults(null);
      }
    });
  }, []);

  const [schedule, setSchedule] = useState<Schedule | null | undefined>(
    undefined
  );
  const [currentTime, setCurrentTime] = useState(new Date());

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
          label: p.block ? `${p.block}` : p.name,
          timeRemaining: p.endTime.getTime() - now.getTime(),
          current: p,
        };
      }

      if (next && now > p.endTime && now < next.startTime) {
        return {
          label: 'PT',
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
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const { label, timeRemaining, current } = schedule
    ? getCurrentPeriodInfo(schedule)
    : { label: '', timeRemaining: null, current: null };

  const formattedTime = formatTimeRemaining(timeRemaining);

  useEffect(() => {
    if (!label) {
      document.title = 'RL Clock';
      return;
    }

    const timeText = formattedTime ? ` (${formattedTime})` : '';
    document.title = `${label}${timeText}`;
  }, [label, formattedTime]);

  const lunchFeatures = menu?.Entrées?.slice(0, 4)
    .flatMap((item) => {
      return item?.name;
    })
    .join('\n');

  const gameResultsFeature = pastResults
    ?.flatMap((result) => {
      const winCount = result.wins.filter(Boolean).length;
      const lossCount = result.wins.filter((win) => !win).length;
      const total = winCount + lossCount;

      // --- Multi-game result (more than 1 match tracked) ---
      if (total > 1) {
        let outcome;
        if (winCount > lossCount) outcome = 'Win';
        else if (lossCount > winCount) outcome = 'Loss';
        else outcome = 'Tie'; // <-- implements ties

        return `${result.team} → ${winCount} - ${lossCount} ${outcome}`;
      }

      // --- Single-game result ---
      const rawScore = result.scores[0];
      const formattedScore = rawScore.replace(/-+/g, ' - ');

      // detect tie by score
      const [a, b] = rawScore.split(/-+/).map(Number);
      const outcome = a === b ? 'Tie' : a > b ? 'Win' : 'Loss';

      return `${result.team} → ${formattedScore} ${outcome}`;
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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          padding: '12px 20px',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: isMobile ? '0.5rem' : '1.1rem',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '50%',
            borderRadius: isMobile ? '3vh' : '2vw',
            backgroundColor: isDarkMode ? 'black' : 'white',
            color: 'rgb(154, 31, 54)',
            cursor: 'pointer',
            boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
            padding: isMobile ? '0.5rem' : '1rem',
            transition:
              'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 4px 30px 4px rgba(154, 31, 54, 0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 4px 20px 4px rgba(154, 31, 54, 0.5)';
          }}
        >
          <Link
            to="/exams"
            style={{
              color: 'rgb(154,31,54)',
              textDecoration: 'none',
            }}
          >
            2025 Midyear Exam Schedule Available &gt;&gt; Click Here!
          </Link>
        </div>
      </motion.div>

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
            {/* <ServiceDriveCard
            title="Thanksgiving Food Drive!"
            numDonations={serviceData?.numDonations || 0}
            donationGoal={serviceData?.donationGoal || 1000}
            path="/service"
            isDarkMode={isDarkMode}
          /> */}
            {pastResults !== undefined ? (
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
            ) : null}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;
