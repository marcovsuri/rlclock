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

  // Animate number counters manually
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
      onClick={() => navigate(path)}
      style={{
        width: isMobile ? 'auto' : 'auto',
        minWidth: isMobile ? '80vw' : '25vw',
        padding: isMobile ? '4vh' : '2vw',
        borderRadius: isMobile ? '3vh' : '2vw',
        backgroundColor: isDarkMode ? 'black' : 'white',
        color: isDarkMode ? '#f0f0f0' : 'rgb(154, 31, 54)',
        cursor: 'pointer',
        // boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
        boxShadow: '0 4px 20px 4px gold',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 'auto',
        textAlign: 'center',
        border: '2px solid gold',
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
      <h2
        style={{
          fontSize: isMobile ? '6vw' : '1.8vw',
          marginBottom: '1vh',
          color: 'rgb(154, 31, 54)',
        }}
      >
        {title}
      </h2>

      <div
        style={{
          margin: '0 0 2vh',
          fontSize: isMobile ? '6vw' : '1.5vw',
        }}
      >
        <div>
          🍦 Participation Leader:{' '}
          <strong>Class {topParticipationClass}</strong>
        </div>
        <div>
          🍕 Points Leader: <strong>Class {topPointsClass}</strong>
        </div>
      </div>

      <h3
        style={{
          fontSize: isMobile ? '6vw' : '1.25vw',
        }}
      >
        {animatedDonations} of {donationGoal} Items Donated
      </h3>

      <div
        style={{
          width: '100%',
          height: isMobile ? '3vh' : '1.2vw',
          backgroundColor: isDarkMode ? '#333' : '#eee',
          borderRadius: isMobile ? '5vh' : '1vw',
          overflow: 'hidden',
          marginTop: '1vh',
          marginBottom: '2vh',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          style={{
            height: '100%',
            background:
              numDonations >= donationGoal
                ? 'linear-gradient(90deg, rgb(31, 154, 101), rgb(0, 255, 94))'
                : 'linear-gradient(90deg, rgb(180, 40, 40), rgb(255, 80, 80))',
          }}
        />
      </div>

      <p
        style={{
          margin: 0,
          fontSize: isMobile ? '3.5vw' : '0.9vw',
          color: isDarkMode ? 'white' : 'black',
        }}
      >
        Click to learn more!
      </p>
    </div>
  );
};

export default ServiceMonthCard;
