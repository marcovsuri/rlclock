import React from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  title: string;
  subtitle: React.ReactNode; // Allow React nodes, including JSX elements
  info: string;
  path: string;
  isDarkMode: boolean;
};

const InfoCard: React.FC<Props> = ({
  title,
  subtitle,
  info,
  path,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        width: isMobile ? 'auto' : 'auto',
        padding: isMobile ? '4vh' : '2vw',
        borderRadius: isMobile ? '3vh' : '2vw',
        backgroundColor: isDarkMode ? 'black' : 'white',
        color: 'rgb(154, 31, 54)',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 'auto',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 30px rgba(154, 31, 54, 0.5)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 20px rgba(154, 31, 54, 0.5)';
      }}
    >
      <h3
        style={{
          margin: '0 0 1vh',
          fontSize: isMobile ? '4vw' : '1.2vw',
          color: isDarkMode ? 'white' : 'black',
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <h3
        style={{
          margin: '0 0 2vh',
          fontSize: isMobile ? '6vw' : '1.75vw',
        }}
      >
        {subtitle}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? '3.5vw' : '0.9vw',
          color: isDarkMode ? 'white' : 'black',
        }}
      >
        {info}
      </p>
    </div>
  );
};

export default InfoCard;
