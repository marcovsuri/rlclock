import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

import useIsMobile from '../../hooks/useIsMobile';
import confetti from 'canvas-confetti';

type Props = {
  title: string;
  numDonations: number;
  donationGoal: number;
  topParticipationClass: string;
  topPointsClass: string;
  path: string;
  isDarkMode: boolean;
};

const ServiceMonthCard: React.FC<Props> = ({
  title,
  numDonations,
  donationGoal,
  topParticipationClass,
  topPointsClass,
  path,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const targetPercent = Math.min((numDonations / donationGoal) * 100, 100);
  const [animatedDonations, setAnimatedDonations] = useState(0);

  const controls = useAnimation();

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    let hasFiredConfetti = false;

    const animateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newDonations = progress * numDonations;

      setAnimatedDonations(Math.floor(newDonations));

      if (!hasFiredConfetti && newDonations >= donationGoal) {
        hasFiredConfetti = true;

        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

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
      }

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);

    controls.start(
      { width: `${targetPercent}%` },
      { duration: duration / 1000, ease: 'linear' },
    );
  }, [targetPercent, numDonations, donationGoal, controls]);

  const maroon = isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)';

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        width: '100%',
        boxSizing: 'border-box' as const,
        padding: isMobile ? '2.5vh 3vw 3vh' : '1vw 1.5vw 1.2vw',
        borderRadius: isMobile ? '3vw' : '0.8vw',
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        color: isDarkMode ? '#E8EAED' : '#202124',
        cursor: 'pointer',
        borderLeft: `3px solid ${maroon}`,
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 0,
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
        (e.currentTarget as HTMLElement).style.boxShadow = isDarkMode
          ? '0 4px 16px rgba(0,0,0,0.6)'
          : '0 4px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = isDarkMode
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '3vw' : '1.5vw',
        }}
      >
        {/* Left: title + leaders + donation count */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 0.5em',
              fontSize: isMobile ? 20 : 24,
              color: maroon,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3em',
            }}
          >
            {title}
          </h3>

          {/* Leaders */}
          <div
            style={{
              fontSize: 16,
              marginBottom: '0.6em',
              lineHeight: 1.5,
              color: isDarkMode ? '#B0B5BA' : '#5F6368',
            }}
          >
            <div>
              Participation Leader:{' '}
              <strong style={{ color: isDarkMode ? '#E8EAED' : '#202124' }}>
                Class {topParticipationClass}
              </strong>
            </div>
            <div>
              Points Leader:{' '}
              <strong style={{ color: isDarkMode ? '#E8EAED' : '#202124' }}>
                Class {topPointsClass}
              </strong>
            </div>
          </div>

          {/* Donation count */}
          <div
            style={{
              fontSize: isMobile ? 13 : 14,
              color: isDarkMode ? '#B0B5BA' : '#5F6368',
              fontWeight: 500,
            }}
          >
            {animatedDonations} of {donationGoal} Items Donated
          </div>
        </div>

        {/* Right: percentage + chevron */}
        <span
          style={{
            fontSize: isMobile ? 36 : 44,
            fontWeight: 700,
            color: isDarkMode ? '#E8EAED' : '#202124',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {Math.min(Math.round((animatedDonations / donationGoal) * 100), 100)}%
        </span>
        <span
          style={{
            fontSize: isMobile ? 20 : 24,
            color: isDarkMode ? '#B0B5BA' : '#5F6368',
            flexShrink: 0,
          }}
        >
          ›
        </span>
      </div>

      {/* Progress bar — full width */}
      <div
        style={{
          width: '100%',
          height: isMobile ? '1.5vh' : '0.5vw',
          marginTop: '0.6em',
          backgroundColor: isDarkMode ? '#4A4B4D' : '#F2F2F2',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          style={{
            height: '100%',
            borderRadius: '999px',
            background:
              numDonations >= donationGoal
                ? 'linear-gradient(90deg, rgb(31, 154, 101), rgb(0, 200, 80))'
                : `linear-gradient(90deg, ${maroon}, rgb(200, 60, 80))`,
          }}
        />
      </div>
    </div>
  );
};

export default ServiceMonthCard;
