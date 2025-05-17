import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lunch from './pages/Lunch';
import Sports from './pages/Sports';
import ExamSchedule from './pages/ExamSchedule';
import DarkModeToggle from './components/home/DarkModeToggle';
import Footer from './components/home/Footer';
import AnnouncementsButton from './components/home/AnnouncementsButton';
import getAnnouncements from './core/announcementsFetcher';
import { Announcement } from './types/announcements';
import './styles.css';
import SidebarNav from './components/global/SidebarNav';
import useIsMobile from './hooks/useIsMobile';

const AnimatedRoutes = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/lunch" element={<Lunch isDarkMode={isDarkMode} />} />
        <Route path="/sports" element={<Sports isDarkMode={isDarkMode} />} />
        <Route
          path="/exams"
          element={<ExamSchedule isDarkMode={isDarkMode} />}
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
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

  const buttonContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '2vh',
    right: '2vw',
    display: 'flex',
    gap: '1vw',
    zIndex: 1000,
  };

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
        isOpen={sidebarOpen}
        // onClose={() => setSidebarOpen(false)}
      />

      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: sidebarOpen ? (isMobile ? '1rem' : '250px') : '1rem',
          zIndex: 1002,
          backgroundColor: 'rgba(154, 31, 54, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'left 0.3s ease',
        }}
      >
        {sidebarOpen ? '✖' : '☰'}
      </button>

      {/* Main Content + Footer */}
      {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <AnimatedRoutes isDarkMode={isDarkMode} />
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div> */}

      <AnimatedRoutes isDarkMode={isDarkMode} />

      <Footer isDarkMode={isDarkMode} />

      {/* Modal Overlay */}
      <div
        className={`modal-backdrop ${showModal ? 'show' : 'hide'}`}
        onClick={() => setShowModal(false)}
      >
        <div
          className={`modal-content ${showModal ? 'modal-show' : ''}`}
          style={{
            background: isDarkMode ? 'black' : 'white',
            color: isDarkMode ? 'white' : 'black',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setShowModal(false)}
          >
            ✖ Close
          </button>
          <h2 style={{ marginBottom: '4rem' }}>📣 Announcements</h2>

          {announcements.length > 0 ? (
            announcements.map(({ id, title, content, author, created_at }) => (
              <div
                key={id}
                className="modal-announcement"
                style={{
                  background: isDarkMode ? 'black' : 'white',
                  color: isDarkMode ? 'white' : 'black',
                  marginBottom: '2rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(154, 31, 54, 0.2)',
                }}
              >
                <h3 style={{ color: 'rgb(154, 31, 54)' }}>{title}</h3>
                <p>{content}</p>
                <small style={{ color: isDarkMode ? '#aaa' : '#444' }}>
                  By {author} —{' '}
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
    </div>
  );
};

export default App;
