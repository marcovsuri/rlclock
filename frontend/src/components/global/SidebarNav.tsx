import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile';
import AnnouncementsButton from './AnnouncementsButton';

interface SidebarNavProps {
  isDarkMode: boolean;
  onOpenAnnouncements: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Lunch', path: '/lunch' },
  { label: 'Sports', path: '/sports' },
  { label: 'Service', path: '/service' },
];

const SidebarNav: React.FC<SidebarNavProps> = ({
  isDarkMode,
  onOpenAnnouncements,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const dividerColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const drawerWidth = isMobile ? '36vw' : '8.5vw';

  return (
    <>
      {/* Backdrop scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: drawerWidth,
          backgroundColor: isDarkMode
            ? '#1F1F1F'
            : '#F8F9FA',
          padding: isMobile ? '3.5rem 0 2rem' : '2.2rem 0 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease, background-color 3s ease, box-shadow 3s ease',
          borderRadius: isMobile ? '0 3vw 3vw 0' : '0 0.8vw 0.8vw 0',
          boxShadow: isOpen
            ? isDarkMode
              ? '4px 0 20px rgba(0,0,0,0.5)'
              : '4px 0 20px rgba(0,0,0,0.08)'
            : 'none',
          zIndex: 1001,
          pointerEvents: isOpen ? 'auto' : 'none',
          boxSizing: 'border-box',
          overflow: 'hidden',
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
                    fontSize: isMobile ? '0.88rem' : '0.82rem',
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

        <div />
      </div>
    </>
  );
};

export default SidebarNav;
