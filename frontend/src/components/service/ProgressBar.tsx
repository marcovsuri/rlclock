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

  const controls = useAnimation();

  // Animate number counters
  useEffect(() => {
    const duration = 2000; // ms
    const startTime = performance.now();
    let hasFiredConfetti = false;

    const animateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newDonations = progress * numDonations;

      setAnimatedDonations(Math.floor(newDonations));

      // Trigger confetti if goal reached and hasn't fired yet
      if (!hasFiredConfetti && newDonations >= donationGoal) {
        hasFiredConfetti = true;

        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        // extra burst
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

  return (
    <div
      style={{
        width: '100%',
        maxWidth: isMobile ? '90vw' : '50vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: isMobile ? '3vh' : '1.2vw',
          backgroundColor: isDarkMode ? '#333' : '#eee',
          borderRadius: isMobile ? '5vh' : '1vw',
          overflow: 'hidden',
          marginBottom: isMobile ? '2vh' : '1vw',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          style={{
            height: '100%',
            background:
              numDonations >= donationGoal
                ? 'linear-gradient(90deg, rgb(31, 154, 101),rgb(0, 255, 94))'
                : 'linear-gradient(90deg, rgb(154,31,54), rgb(255,0,50))',
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: isMobile ? '4vw' : '1.5vw',
          fontWeight: 500,
          color: isDarkMode ? '#fff' : '#222',
        }}
      >
        {animatedDonations} of {donationGoal} Items Donated
      </span>
    </div>
  );
};

export default DonationProgressBar;
