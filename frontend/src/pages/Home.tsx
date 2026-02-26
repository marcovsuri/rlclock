import React, { use } from 'react';
import { motion } from 'framer-motion';
import Clock from '../components/home/Clock';
import InfoCard from '../components/home/InfoCard';
import useIsMobile from '../hooks/useIsMobile';
import { useEffect, useRef, useState } from 'react';
import getMenu from '../core/lunchFetcher';
import { Menu } from '../types/lunch';
import getSportsEvents from '../core/sportsFetcher';
import { TeamEvent } from '../types/sports';
import ServiceMonthCard from '../components/home/ServiceMonthCard';
import confetti from 'canvas-confetti';
import getServiceData from '../core/serviceDataFetcher';
import { ServiceData } from '../types/serviceData';
import { getSchedule, Schedule } from '../core/clockFetcher';
import { Link } from 'react-router-dom';

import Footer from '../components/global/Footer';
import {
  getServiceMonthCounter,
  getServiceMonthLeaderboardData,
  SheetData,
} from '../core/serviceMonthDataFetcher';
import { SHOW_SERVICE } from '../config';
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
  const [serviceMonthCounter, setServiceMonthCounter] = useState<number>(0);
  const [serviceMonthParticipationLeader, setServiceMonthParticipationLeader] =
    useState<string>('');
  const [serviceMonthPointsLeader, setServiceMonthPointsLeader] =
    useState<string>('');
  const DONATION_GOAL = 7500;

  useEffect(() => {
    if (!SHOW_SERVICE) return;
    getServiceData().then((result) => {
      if (result.success) {
        setServiceData(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!SHOW_SERVICE) return;
    getServiceMonthCounter().then((result) => {
      if (result.success) {
        setServiceMonthCounter(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!SHOW_SERVICE) return;
    getServiceMonthLeaderboardData().then((result) => {
      if (result.success) {
        const data = result.data;

        if (data.length === 0) return;

        const topParticipation = data.reduce((prev, current) =>
          current.participationPercentage > prev.participationPercentage
            ? current
            : prev
        );
        const topPoints = data.reduce((prev, current) =>
          current.points > prev.points ? current : prev
        );

        setServiceMonthParticipationLeader(topParticipation.class);
        setServiceMonthPointsLeader(topPoints.class);
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

      let year = now.getFullYear();

      if (month > now.getMonth() + 1 + 2) {
        year -= 1;
      }

      return new Date(year, month - 1, day);
    };
    getSportsEvents().then((response) => {
      if (response.success) {
        const now = new Date();
        const firstDayOfSchool =
          now.getMonth() + 1 >= 8
            ? new Date(now.getFullYear(), 7, 25)
            : new Date(now.getFullYear() - 1, 7, 25);
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
          label: next.block ? `PT => ${next.block}` : 'PT',
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

  const hasFiredConfetti = useRef(false);
  useEffect(() => {
    if (hasFiredConfetti.current) return;
    const noSchool =
      schedule === null || label === 'After School' || label === 'No Schedule';
    if (noSchool) {
      hasFiredConfetti.current = true;
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 50,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 50,
          origin: { x: 1 },
        });
      }, 0);
    }
  }, [label, schedule]);

  const lunchEntrees = menu?.Entrées;
  const lunchSummary = lunchEntrees?.length
    ? (() => {
        const groups: { lastWord: string; prefixes: string[] }[] = [];
        for (const item of lunchEntrees) {
          const name = item?.name || '';
          const words = name.split(' ');
          const lastWord = words[words.length - 1];
          const prefix = words.slice(0, -1).join(' ');
          const existing = groups.find((g) => g.lastWord === lastWord);
          if (existing) {
            existing.prefixes.push(prefix);
          } else {
            groups.push({ lastWord, prefixes: [prefix] });
          }
        }
        return (
          <span
            style={{ display: 'flex', flexDirection: 'column', gap: '0.15em' }}
          >
            {groups.map((g, i) => {
              const descriptors = g.prefixes.filter((p) => p);
              return (
                <span key={i}>
                  {descriptors.length > 0 ? `${descriptors.join(', ')} ` : ''}
                  {g.lastWord}
                </span>
              );
            })}
          </span>
        );
      })()
    : null;

  const decodeHtml = (s: string) => {
    const el = document.createElement('textarea');
    el.innerHTML = s;
    return el.value;
  };

  const resultItems =
    pastResults && pastResults.length > 0
      ? pastResults.map((result) => {
          const winCount = result.wins.filter(Boolean).length;
          const lossCount = result.wins.filter((win) => !win).length;
          const total = winCount + lossCount;

          let outcome = '';
          if (total > 1) {
            if (winCount > lossCount) outcome = 'W';
            else if (lossCount > winCount) outcome = 'L';
            else outcome = 'T';
          } else {
            const rawScore = result.scores?.[0];
            if (rawScore) {
              const raw = String(rawScore);
              const [a, b] = raw.split(/-+/).map(Number);
              if (Number.isFinite(a) && Number.isFinite(b)) {
                outcome = a === b ? 'T' : a > b ? 'W' : 'L';
              }
            }
          }

          const score = result.scores?.join(', ') || '—';

          const opponent = decodeHtml(result.opponents?.join(', ') || '');

          return { team: decodeHtml(result.team), opponent, score, outcome };
        })
      : null;

  const pillColors = (o: string) => {
    if (o === 'W')
      return {
        bg: isDarkMode ? 'rgba(74, 222, 128, 0.15)' : 'rgba(22, 163, 74, 0.1)',
        text: isDarkMode ? '#4ade80' : '#16a34a',
      };
    if (o === 'L')
      return {
        bg: isDarkMode ? 'rgba(154, 160, 166, 0.15)' : 'rgba(95, 99, 104, 0.1)',
        text: isDarkMode ? '#B0B5BA' : '#5F6368',
      };
    return {
      bg: isDarkMode ? 'rgba(154, 160, 166, 0.15)' : 'rgba(95, 99, 104, 0.1)',
      text: isDarkMode ? '#B0B5BA' : '#5F6368',
    };
  };

  const resultsSummary = resultItems ? (
    <span
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: '0.35em 0',
        alignItems: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {resultItems.map((item, i) => {
        const parts = item.score.split(/-+/);
        const hasTwoParts = parts.length === 2;
        const [a, b] = hasTwoParts ? parts.map(Number) : [NaN, NaN];
        const canBold = Number.isFinite(a) && Number.isFinite(b) && a !== b;
        const bold = canBold
          ? ({
              fontWeight: 700,
              color: isDarkMode ? '#E8EAED' : '#202124',
            } as const)
          : undefined;
        const faint = { color: isDarkMode ? '#B0B5BA' : '#5F6368' };
        return (
          <React.Fragment key={i}>
            <span
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                paddingRight: '0.75em',
              }}
            >
              {item.team}
              {item.opponent && (
                <span style={{ ...faint, fontWeight: 400, fontSize: 13 }}>
                  {' '}
                  vs {item.opponent}
                </span>
              )}
            </span>
            <span
              style={{
                ...faint,
                fontSize: 14,
                textAlign: 'right',
                ...(bold && a > b ? bold : {}),
              }}
            >
              {hasTwoParts ? parts[0] : item.score}
            </span>
            <span
              style={{
                ...faint,
                fontSize: 14,
                textAlign: 'center',
                padding: '0 2px',
              }}
            >
              {hasTwoParts ? '-' : ''}
            </span>
            <span
              style={{
                ...faint,
                fontSize: 14,
                textAlign: 'left',
                paddingRight: '0.75em',
                ...(bold && b > a ? bold : {}),
              }}
            >
              {hasTwoParts ? parts[1] : ''}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 7px 2px',
                borderRadius: '999px',
                backgroundColor: pillColors(item.outcome).bg,
                color: pillColors(item.outcome).text,
                minWidth: '1.5em',
                textAlign: 'center',
                justifySelf: 'end',
              }}
            >
              {item.outcome === 'W'
                ? 'Win'
                : item.outcome === 'L'
                ? 'Loss'
                : item.outcome === 'T'
                ? 'Tie'
                : '—'}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  ) : null;

  const hasLunch =
    menu !== undefined &&
    (menu?.Entrées?.length > 0 ||
      menu?.['Sides and Vegetables']?.length > 0 ||
      menu?.Soups?.length > 0);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    scrollbarWidth: 'none',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'center',
    alignItems: isMobile ? 'center' : 'center',
    padding: isMobile ? '2vw' : '2vw',
    paddingTop: isMobile ? '2vh' : '2vw',
    gap: isMobile ? '1.5vh' : '2vw',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  const clockStyle: React.CSSProperties = {
    width: isMobile ? '100%' : '34vw',
  };

  const cardsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: isMobile ? '1.5vh' : '1vw',
    width: isMobile ? '93vw' : '34vw',
    boxSizing: 'border-box',
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={containerStyle}
      >
        {/* Main Content */}
        <main style={contentStyle}>
          <h1
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
            }}
          >
            RL Clock Dashboard
          </h1>
          {/* Left: Clock (schedule + countdown) */}
          <div style={clockStyle}>
            <Clock isDarkMode={isDarkMode} />
          </div>

          {/* Right: Cards ordered by urgency */}
          <div style={cardsStyle}>
            {/* 1. Lunch status - compact */}
            <InfoCard
              title="Today's Lunch"
              compact
              subtitle={
                menu === undefined
                  ? 'Loading...'
                  : !hasLunch || !lunchSummary
                  ? 'No lunch served today.'
                  : lunchSummary
              }
              path="/lunch"
              isDarkMode={isDarkMode}
            />

            {/* 2. Service Month */}
            {SHOW_SERVICE && (
              <ServiceMonthCard
                title="Service Month"
                numDonations={serviceMonthCounter || 0}
                donationGoal={DONATION_GOAL}
                topParticipationClass={serviceMonthParticipationLeader}
                topPointsClass={serviceMonthPointsLeader}
                path="/service"
                isDarkMode={isDarkMode}
              />
            )}

            {/* 3. Condensed Athletics Results */}
            {pastResults !== undefined && (
              <InfoCard
                title="Latest Results"
                compact
                subtitle={
                  pastResults === undefined
                    ? 'Loading...'
                    : resultsSummary ?? 'No recent results.'
                }
                path="/sports"
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </main>
        <Footer isDarkMode={isDarkMode} />
      </motion.div>
    </>
  );
};

export default Home;
