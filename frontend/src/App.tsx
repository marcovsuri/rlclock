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

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('welcomeDismissed');
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailsCopied, setEmailsCopied] = useState(false);
  const isMobile = useIsMobile();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeDismissed', '1');
  };

  const anyModalOpen = showModal || showWelcome || showFeedback;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowFeedback(false);
        dismissWelcome();
      }
    };

    if (showModal) {
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
  }, [showModal]);

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
        toggleDarkMode={toggleDarkMode}
        onOpenAnnouncements={() => setShowModal(true)}
        onOpenFeedback={() => setShowFeedback(true)}
        isOpen={sidebarOpen}
      />

      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          padding: isMobile ? '0.35rem 0.5rem' : '0.3rem 0.45rem',
          borderRadius: isMobile ? '6px' : '0.3vw',
          border: 'none',
          backgroundColor: 'transparent',
          color: isDarkMode ? '#9AA0A6' : '#5F6368',
          fontSize: 16,
          lineHeight: 1,
          cursor: 'pointer',
          boxShadow: '0 2px 6px 4px rgba(154, 31, 54, 0.5)',
          transition: 'left 0.5s ease, box-shadow 0.3s ease',
          position: 'fixed',
          top: '1rem',
          left: sidebarOpen ? (isMobile ? '1rem' : '11vw') : '1rem',
          zIndex: 1002,
          marginLeft: '0',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            '0 4px 12px 6px rgba(154, 31, 54, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            '0 2px 6px 4px rgba(154, 31, 54, 0.5)';
        }}
      >
        {sidebarOpen ? '✖' : '☰'}
      </button>

      {/* Main Content + Footer */}
      <div style={{ flex: 1 }}>
        <AnimatedRoutes isDarkMode={isDarkMode} />
      </div>

      {/* Welcome Popup */}
      <div
        className={`modal-backdrop ${showWelcome ? 'show' : 'hide'}`}
        onClick={() => dismissWelcome()}
        style={{ zIndex: 10001 }}
      >
        <div
          className={`modal-content ${showWelcome ? 'modal-show' : ''}`}
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
            User Interface Refresh
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
            and Austin Reid. Enjoy the new look of RL Clock!
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              margin: '0 0 1.5rem',
              color: isDarkMode ? '#9AA0A6' : '#5F6368',
            }}
          >
            This message will only show up once.
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
              onClick={() => dismissWelcome()}
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
              Got it
            </button>
          </div>
        </div>
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
            background: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
            padding: '2rem',
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
            ✖ Close
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
                className="modal-announcement"
                style={{
                  background: 'rgba(154, 31, 54, 0.1)',
                  color: isDarkMode ? 'white' : 'black',
                  marginBottom: '2rem',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(154, 31, 54, 0.2)',
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
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  @{' '}
                  {new Date(created_at).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </small>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No current announcements.</p>
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
