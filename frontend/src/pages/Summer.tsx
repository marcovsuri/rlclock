import React, { useState, useEffect } from 'react';
import SummerCountdown from '../components/summer/SummerCountdown';
import useIsMobile from '../hooks/useIsMobile';

interface SummerProps {
  isDarkMode: boolean;
}

const getCountdownString = (): string => {
  const targetDate = new Date('2025-08-25T08:20:00-04:00');
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return '00d : 00h : 00m : 00s';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
};

const Summer: React.FC<SummerProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();
  const [countdown, setCountdown] = useState(getCountdownString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <SummerCountdown
        title="🌞 Happy Summer Break! 🎉"
        subtitle={
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 500,
              boxShadow: '0 4px 20px 8px rgba(154, 31, 54, 0.8)',
              border: '1px solid rgba(154, 31, 54, 1)',
              padding: isMobile ? '2vh' : '2vh 2vw',
              fontSize: isMobile ? '4vw' : '3vw',
              borderRadius: '16px',
            }}
          >
            {countdown}
          </span>
        }
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Summer;
