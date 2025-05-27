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
        maxWidth: isMobile ? '90vw' : '50vw',
        minWidth: isMobile ? '80vw' : '25vw',
        padding: isMobile ? '4vh' : '4vw',
        borderRadius: isMobile ? '3vh' : '2vw',
        backgroundColor: isDarkMode ? 'black' : 'white',
        color: 'rgb(154, 31, 54)',
        boxShadow: '0 4px 20px 4px rgba(154, 31, 54, 0.5)',
        transition: 'all 3s ease',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          margin: '0 0 6vh 0',
          fontSize: isMobile ? '4vw' : '4vw',
          color: isDarkMode ? 'white' : 'black',
          fontWeight: 1000,
        }}
      >
        {title}
      </h1>
      <h3
        style={{
          margin: '5vh 0 0 0',
          fontSize: isMobile ? '6vw' : '2vw',
        }}
      >
        {subtitle}
      </h3>
    </div>
  );
};

export default InfoCard;
