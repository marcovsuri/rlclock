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
      { duration: duration / 1000, ease: 'linear' }
    );
  }, [targetPercent, numDonations, donationGoal, controls]);

  const maroon = isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)';

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        width: isMobile ? 'auto' : 'auto',
        minWidth: isMobile ? '80vw' : '25vw',
        padding: isMobile ? '3vh 3vw' : '1.2vw 1.5vw',
        borderRadius: isMobile ? '3vw' : '0.8vw',
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        color: isDarkMode ? '#E8EAED' : '#202124',
        cursor: 'pointer',
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 'auto',
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
      {/* Header row with title and chevron */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5em',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: isMobile ? '4vw' : '1vw',
            color: maroon,
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontSize: isMobile ? '5vw' : '1.2vw',
            color: isDarkMode ? '#9AA0A6' : '#5F6368',
            flexShrink: 0,
          }}
        >
          ›
        </span>
      </div>

      {/* Leaders */}
      <div
        style={{
          fontSize: isMobile ? '3.5vw' : '0.9vw',
          marginBottom: '0.6em',
          lineHeight: 1.5,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
        }}
      >
        <div>
          Participation Leader:{' '}
          <strong
            style={{
              color: isDarkMode ? '#E8EAED' : '#202124',
            }}
          >
            Class {topParticipationClass}
          </strong>
        </div>
        <div>
          Points Leader:{' '}
          <strong
            style={{
              color: isDarkMode ? '#E8EAED' : '#202124',
            }}
          >
            Class {topPointsClass}
          </strong>
        </div>
      </div>

      {/* Progress */}
      <div
        style={{
          fontSize: isMobile ? '3.2vw' : '0.8vw',
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          marginBottom: '0.4em',
          fontWeight: 500,
        }}
      >
        {animatedDonations} of {donationGoal} Items Donated
      </div>

      <div
        style={{
          width: '100%',
          height: isMobile ? '1.5vh' : '0.5vw',
          backgroundColor: isDarkMode
            ? '#4A4B4D'
            : '#F2F2F2',
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
