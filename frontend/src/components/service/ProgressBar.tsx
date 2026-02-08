import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';
import confetti from 'canvas-confetti';

type Props = {
  numDonations: number;
  donationGoal: number;
  isDarkMode: boolean;
};

const DonationProgressBar: React.FC<Props> = ({
  numDonations,
  donationGoal,
  isDarkMode,
}) => {
  const isMobile = useIsMobile();

  const targetPercent = Math.min((numDonations / donationGoal) * 100, 100);
  const [animatedDonations, setAnimatedDonations] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const controls = useAnimation();

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    let hasFiredConfetti = false;

    const animateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newDonations = progress * numDonations;

      setAnimatedDonations(Math.floor(newDonations));
      setAnimatedPercent(Math.round(progress * targetPercent));

      if (!hasFiredConfetti && newDonations >= donationGoal) {
        hasFiredConfetti = true;
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        confetti({ particleCount: 80, angle: 60, spread: 50, origin: { x: 0 } });
        confetti({ particleCount: 80, angle: 120, spread: 50, origin: { x: 1 } });
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

  const goalReached = numDonations >= donationGoal;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: isMobile ? '92vw' : '40vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '1vh' : '0.4vw',
      }}
    >
      {/* Percentage */}
      <span
        style={{
          fontSize: isMobile ? '5vw' : '1.4vw',
          fontWeight: 700,
          color: goalReached
            ? isDarkMode ? '#4ade80' : '#16a34a'
            : isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
        }}
      >
        {animatedPercent}%
      </span>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: isMobile ? '2.5vh' : '0.8vw',
          backgroundColor: isDarkMode ? '#2D2E30' : '#F2F2F2',
          borderRadius: isMobile ? '5vh' : '1vw',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          style={{
            height: '100%',
            borderRadius: 'inherit',
            backgroundColor: goalReached
              ? isDarkMode ? '#4ade80' : '#16a34a'
              : isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: isMobile ? '3vw' : '0.8vw',
          fontWeight: 500,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
        }}
      >
        {animatedDonations.toLocaleString()} of {donationGoal.toLocaleString()} items donated
      </span>
    </div>
  );
};

export default DonationProgressBar;
