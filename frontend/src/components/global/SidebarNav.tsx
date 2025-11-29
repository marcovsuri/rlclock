import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import useIsMobile from '../../hooks/useIsMobile';
import AnnouncementsButton from './AnnouncementsButton';

interface SidebarNavProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAnnouncements: () => void;
  isOpen: boolean;
}

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Lunch', path: '/lunch' },
  { label: 'Sports', path: '/sports' },
  { label: 'Service', path: '/service' },
  // { label: 'Exams', path: '/exams' }, // Comment out to remove exams
];

const SidebarNav: React.FC<SidebarNavProps> = ({
  isDarkMode,
  toggleDarkMode,
  onOpenAnnouncements,
  isOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const getButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: isMobile ? '0.8vh 4vw' : '0.8vh 1.5vw',
    borderRadius: '12px',
    border: '1px solid rgba(154, 31, 54, 0.2)',
    backgroundColor: active
      ? 'rgba(154, 31, 54, 0.1)'
      : 'rgba(154, 31, 54, 0.3)',
    color: active ? 'rgb(168, 80, 96)' : isDarkMode ? 'white' : 'black',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active
      ? '0 6px 12px 6px rgba(154, 31, 54, 0.4)'
      : '0 2px 6px 4px rgba(154, 31, 54, 0.2)',
    transition: 'all 0.3s ease, box-shadow 0.5s ease',
    width: '100%',
    textAlign: 'left',
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: isMobile ? '50vw' : '12vw',
        backgroundColor: isDarkMode
          ? 'rgba(17, 17, 17, 0.5)'
          : 'rgba(253, 253, 253, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(5px)',
        padding: isMobile ? '6rem 1.5rem 2rem' : '4rem 2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 3s ease, transform 0.5s ease, box-shadow 0.5s ease',
        borderRadius: '16px',
        zIndex: 1001,
        pointerEvents: isOpen ? 'auto' : 'none',
        boxShadow: isOpen ? '4px 0 30px 4px  rgba(154, 31, 54, 0.5)' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: isMobile ? '0' : '2rem',
        }}
      >
        {navItems.map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={getButtonStyle(location.pathname === path)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '1rem',
          marginBottom: isMobile ? '7rem' : '6rem',
        }}
      >
        <div>
          <AnnouncementsButton onClick={onOpenAnnouncements} />
        </div>

        <div>
          <DarkModeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
