import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  title: string;
  subtitle: React.ReactNode; // Allow React nodes, including JSX elements
  isDarkMode: boolean;
};

const InfoCard: React.FC<Props> = ({ title, subtitle, isDarkMode }) => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        maxWidth: '75vw',
        minWidth: isMobile ? 'fit-content' : '25vw',
        padding: isMobile ? '4vh' : '4vw',
        borderRadius: isMobile ? '3vh' : '2vw',
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
        boxShadow: isDarkMode
          ? '0 2px 12px rgba(0,0,0,0.5)'
          : '0 2px 12px rgba(0,0,0,0.1)',
        transition: 'all 3s ease',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          margin: isMobile ? '0 0 3vh 0' : '0 0 4vh 0',
          fontSize: isMobile ? '6vw' : '4vw',
          color: isDarkMode ? '#E8EAED' : '#202124',
          fontWeight: 1000,
        }}
      >
        {title}
      </h1>
      <h3
        style={{
          margin: isMobile ? '1vw' : '0',
          fontSize: isMobile ? '6vw' : '2vw',
        }}
      >
        {subtitle}
      </h3>
    </div>
  );
};

export default InfoCard;
