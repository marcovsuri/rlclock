import React from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  title: string;
  subtitle: React.ReactNode;
  info?: string;
  path: string;
  isDarkMode: boolean;
  compact?: boolean;
};

const InfoCard: React.FC<Props> = ({
  title,
  subtitle,
  info,
  path,
  isDarkMode,
  compact = false,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        boxSizing: 'border-box' as const,
        padding: compact
          ? isMobile
            ? '2.5vh 3vw'
            : '0.8vw 1.2vw'
          : isMobile
            ? '3vh 3vw'
            : '1.2vw 1.5vw',
        borderRadius: isMobile ? '3vw' : '0.8vw',
        backgroundColor: isDarkMode ? '#2D2E30' : '#FFFFFF',
        color: isDarkMode ? '#E8EAED' : '#202124',
        cursor: 'pointer',
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, background-color 3s ease, color 3s ease',
        margin: 0,
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '2vw' : '1vw',
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            margin: 0,
            fontSize: isMobile ? 13 : 14,
            color: isDarkMode ? '#9AA0A6' : '#5F6368',
            fontWeight: 500,
            marginBottom: compact ? '0.2em' : '0.4em',
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: isDarkMode ? '#E8EAED' : '#202124',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
      {/* Chevron */}
      <span
        style={{
          fontSize: isMobile ? 20 : 24,
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          flexShrink: 0,
        }}
      >
        {'›'}
      </span>
    </div>
  );
};

export default InfoCard;
