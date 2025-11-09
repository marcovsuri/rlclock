import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  title: string;
  numDonations: number;
  donationGoal: number;
  path: string;
  isDarkMode: boolean;
};

const ServiceDriveCard: React.FC<Props> = ({
  title,
  numDonations,
  donationGoal,
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

    const animateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newDonations = progress * numDonations;

      setAnimatedDonations(Math.floor(newDonations));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
    controls.start(
      { width: `${targetPercent}%` },
      { duration: duration / 1000, ease: 'linear' }
    );
  }, [targetPercent, numDonations, controls]);

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
        boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 'auto',
        textAlign: 'center',
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

      <h3
        style={{
          margin: '0 0 2vh',
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
            background: 'linear-gradient(90deg, rgb(154,31,54), #ff6f61)',
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

export default ServiceDriveCard;
