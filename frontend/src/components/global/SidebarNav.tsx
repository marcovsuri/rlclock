import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from '../home/DarkModeToggle';
import useIsMobile from '../../hooks/useIsMobile';
import AnnouncementsButton from '../home/AnnouncementsButton';

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
  { label: 'Exams', path: '/exams' },
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
    padding: '0.8vh 1.5vw',
    borderRadius: '12px',
    border: '1px solid rgba(154, 31, 54, 0.2)',
    backgroundColor: active
      ? 'rgba(154, 31, 54, 0.9)'
      : 'rgba(154, 31, 54, 0.1)',
    color: active ? '#fff' : 'rgba(154, 31, 54, 1)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active
      ? '0 6px 12px rgba(154, 31, 54, 0.4)'
      : '0 2px 6px rgba(154, 31, 54, 0.2)',
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
        width: isMobile ? '100vw' : '240px',
        backgroundColor: isDarkMode ? '#111' : '#fdfdfd',
        padding: isMobile ? '6rem 1.5rem 2rem' : '4rem 1rem 2rem',
        borderRight: isMobile ? 'none' : '1px solid rgba(154, 31, 54, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1001,
        pointerEvents: isOpen ? 'auto' : 'none',
        boxShadow: isMobile && isOpen ? '0 0 30px rgba(0,0,0,0.3)' : undefined,
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

      <div style={{ marginTop: '2rem' }}>
        <AnnouncementsButton onClick={onOpenAnnouncements} />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    </div>
  );
};

export default SidebarNav;
