import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lunch from './pages/Lunch';
import Sports from './pages/Sports';
import ExamSchedule from './pages/ExamSchedule';
import Summer from './pages/Summer';
import ServiceMonth from './pages/ServiceMonth';
import getAnnouncements from './core/announcementsFetcher';
import { Announcement } from './types/announcements';
import './styles.css';
import SidebarNav from './components/global/SidebarNav';
import useIsMobile from './hooks/useIsMobile';
import { Navigate } from 'react-router-dom';

const AnimatedRoutes = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* <Route path="/" element={<Summer isDarkMode={isDarkMode} />} /> */}
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/lunch" element={<Lunch isDarkMode={isDarkMode} />} />
        <Route path="/sports" element={<Sports isDarkMode={isDarkMode} />} />
        <Route
          path="/service"
          element={<ServiceMonth isDarkMode={isDarkMode} />}
        />
        {/* <Route path="/summer" element={<Summer isDarkMode={isDarkMode} />} /> */}
        {/* <Route
          path="/exams"
          element={<ExamSchedule isDarkMode={isDarkMode} />}
        /> */}
        {/* <Route path="*" element={<Navigate to="/exams" replace />} /> */}
      </Routes>
    </AnimatePresence>
  );
};

type ThemePreference = 'system' | 'light' | 'dark';

const resolveTheme = (pref: ThemePreference): boolean => {
  if (pref === 'light') return false;
  if (pref === 'dark') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const App: React.FC = () => {
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    () => {
      return (
        (localStorage.getItem('themePreference') as ThemePreference) || 'system'
      );
    },
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const dark = resolveTheme(
      (localStorage.getItem('themePreference') as ThemePreference) || 'system',
    );
    document.documentElement.classList.toggle('dark-mode', dark);
    return dark;
  });
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [emailsCopied, setEmailsCopied] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleThemeChange = (pref: ThemePreference) => {
    localStorage.setItem('themePreference', pref);
    setThemePreference(pref);
    const dark = resolveTheme(pref);
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark-mode', dark);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
      });
    });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (themePreference === 'system') {
        const dark = mq.matches;
        setIsDarkMode(dark);
        document.documentElement.classList.toggle('dark-mode', dark);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themePreference]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const anyModalOpen = showModal || showFeedback;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowFeedback(false);
      }
    };

    if (anyModalOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [anyModalOpen]);

  useEffect(() => {
    getAnnouncements().then((result) => {
      if (result.success) {
        setAnnouncements(result.data);
      }
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <SidebarNav
        isDarkMode={isDarkMode}
        onOpenAnnouncements={() => setShowModal(true)}
        onOpenFeedback={() => setShowFeedback(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        themePreference={themePreference}
        onThemeChange={handleThemeChange}
      />

      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          padding: isMobile ? '0.5rem' : '0.4rem',
          borderRadius: isMobile ? '6px' : '0.3vw',
          border: 'none',
          backgroundColor: 'transparent',
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          fontSize: 16,
          lineHeight: 1,
          cursor: 'pointer',
          transition: 'color 3s ease',
          position: 'fixed',
          top: '0.8rem',
          left: '0.8rem',
          zIndex: 1002,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = isDarkMode ? '#E8EAED' : '#202124';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = isDarkMode ? '#9AA0A6' : '#5F6368';
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="2"
            y1="5"
            x2="16"
            y2="5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transformOrigin: '9px 5px',
              transform: sidebarOpen ? 'translateY(4px) rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease',
            }}
          />
          <line
            x1="2"
            y1="13"
            x2="16"
            y2="13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transformOrigin: '9px 13px',
              transform: sidebarOpen
                ? 'translateY(-4px) rotate(-45deg)'
                : 'none',
              transition: 'transform 0.3s ease',
            }}
          />
        </svg>
      </button>

      {/* Main Content + Footer */}
      <div style={{ flex: 1 }}>
        <AnimatedRoutes isDarkMode={isDarkMode} />
      </div>

      {/* Modal Overlay */}
      <div
        className={`modal-backdrop ${showModal ? 'show' : 'hide'}`}
        onClick={() => setShowModal(false)}
        style={{ zIndex: 10000 }}
      >
        <div
          className={`modal-content ${showModal ? 'modal-show' : ''}`}
          style={{
            background: isDarkMode ? '#2D2E30' : '#FFFFFF',
            color: isDarkMode ? '#E8EAED' : '#202124',
            padding: '1.5rem',
            borderRadius: '0.8rem',
            boxShadow: isDarkMode
              ? '0 4px 24px rgba(0,0,0,0.6)'
              : '0 4px 24px rgba(0,0,0,0.12)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setShowModal(false)}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#9AA0A6' : '#5F6368',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Close
          </button>
          <h2
            style={{
              marginBottom: '2rem',
              fontSize: isMobile ? 26 : 32,
              fontWeight: 600,
              color: isDarkMode ? '#E8EAED' : '#202124',
            }}
          >
            Announcements
          </h2>

          {announcements.length > 0 ? (
            announcements.map(({ id, title, content, author, created_at }) => (
              <div
                key={id}
                style={{
                  backgroundColor: isDarkMode ? '#2D2E30' : '#F2F2F2',
                  color: isDarkMode ? '#E8EAED' : '#202124',
                  marginBottom: '1rem',
                  padding: '1.2rem',
                  borderRadius: '0.6rem',
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 600,
                    marginBottom: '0.4rem',
                    color: isDarkMode ? '#E8EAED' : '#202124',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.5,
                    margin: '0 0 0.6rem',
                  }}
                >
                  {content}
                </p>
                <small
                  style={{
                    color: isDarkMode ? '#9AA0A6' : '#5F6368',
                    fontSize: isMobile ? 13 : 14,
                  }}
                >
                  {author} &middot;{' '}
                  {new Date(created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  {new Date(created_at).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </small>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: 'center',
                color: isDarkMode ? '#9AA0A6' : '#5F6368',
              }}
            >
              No announcements right now.
            </p>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <div
        className={`modal-backdrop ${showFeedback ? 'show' : 'hide'}`}
        onClick={() => setShowFeedback(false)}
        style={{ zIndex: 10000 }}
      >
        <div
          className={`modal-content ${showFeedback ? 'modal-show' : ''}`}
          style={{
            background: isDarkMode ? '#2D2E30' : '#FFFFFF',
            color: isDarkMode ? '#E8EAED' : '#202124',
            padding: '2rem',
            borderRadius: '0.8rem',
            boxShadow: isDarkMode
              ? '0 4px 24px rgba(0,0,0,0.6)'
              : '0 4px 24px rgba(0,0,0,0.12)',
            maxWidth: '420px',
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            style={{
              fontSize: isMobile ? 26 : 32,
              fontWeight: 600,
              margin: '0 0 1rem',
              color: isDarkMode ? '#E8EAED' : '#202124',
            }}
          >
            Send Feedback
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              margin: '0 0 1.5rem',
              color: isDarkMode ? '#E8EAED' : '#202124',
            }}
          >
            Please give any feedback or suggestions to Marco Suri, Dylan Pan,
            and Austin Reid.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  'austin.reid@roxburylatin.org, dylan.pan@roxburylatin.org, marco.suri@roxburylatin.org',
                );
                setEmailsCopied(true);
                setTimeout(() => setEmailsCopied(false), 2000);
              }}
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: 14,
                fontWeight: 600,
                color: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
                backgroundColor: 'transparent',
                border: `1.5px solid ${isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)'}`,
                borderRadius: '0.4rem',
                cursor: 'pointer',
              }}
            >
              {emailsCopied ? 'Copied!' : 'Copy Emails'}
            </button>
            <button
              onClick={() => setShowFeedback(false)}
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: 14,
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: isDarkMode ? '#B0263E' : 'rgb(154, 31, 54)',
                border: 'none',
                borderRadius: '0.4rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
