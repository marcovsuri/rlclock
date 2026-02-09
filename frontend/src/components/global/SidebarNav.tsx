import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import useIsMobile from '../../hooks/useIsMobile';
import AnnouncementsButton from './AnnouncementsButton';

interface SidebarNavProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAnnouncements: () => void;
  onOpenFeedback: () => void;
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
  onOpenFeedback,
  isOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const dividerColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const drawerWidth = isMobile ? '36vw' : '12vw';

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
        {/* Nav items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: isMobile ? '0' : '0.4rem',
          }}
        >
          {navItems.map(({ label, path }, i) => {
            const active = location.pathname === path;
            return (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div style={{ height: '1px', backgroundColor: dividerColor }} />
                )}
                <button
                  onClick={() => { navigate(path); onClose(); }}
                  style={{
                    padding: isMobile ? '0.75rem 1rem' : '0.4vw 0.8vw',
                    border: 'none',
                    borderLeft: active
                      ? `3px solid ${isDarkMode ? '#C43C5A' : 'rgb(154, 31, 54)'}`
                      : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: active
                      ? isDarkMode ? '#C43C5A' : 'rgb(154, 31, 54)'
                      : isDarkMode ? '#9AA0A6' : '#5F6368',
                    fontSize: 16,
                    fontWeight: 450,
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                    transition: 'color 3s ease, border-color 3s ease',
                    width: '100%',
                    textAlign: 'left',
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = isDarkMode
                        ? '#E8EAED' : '#202124';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = isDarkMode
                        ? '#9AA0A6' : '#5F6368';
                    }
                  }}
                >
                  {label}
                </button>
              </React.Fragment>
            );
          })}

          {/* Announcements */}
          <div style={{ height: '1px', backgroundColor: dividerColor }} />
          <AnnouncementsButton onClick={() => { onOpenAnnouncements(); onClose(); }} isDarkMode={isDarkMode} />
        </div>

        {/* Send Feedback */}
        <button
          onClick={() => { onOpenFeedback(); onClose(); }}
          style={{
            padding: isMobile ? '0.75rem 1rem' : '0.4vw 0.8vw',
            border: 'none',
            borderLeft: '3px solid transparent',
            backgroundColor: 'transparent',
            color: isDarkMode ? '#9AA0A6' : '#5F6368',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 450,
            cursor: 'pointer',
            transition: 'color 3s ease',
            width: '100%',
            textAlign: 'left',
            lineHeight: 1.4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDarkMode ? '#E8EAED' : '#202124';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDarkMode ? '#9AA0A6' : '#5F6368';
          }}
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
