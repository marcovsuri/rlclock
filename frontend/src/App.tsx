import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lunch from './pages/Lunch';
import Sports from './pages/Sports';
import DarkModeToggle from './components/home/DarkModeToggle';
import Footer from './components/home/Footer';
import AnnouncementsButton from './components/home/AnnouncementsButton';
import getAnnouncements from './core/announcementsFetcher';
import { Announcement } from './types/announcements';
import './styles.css';

const AnimatedRoutes = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/lunch" element={<Lunch isDarkMode={isDarkMode} />} />
          <Route path="/sports" element={<Sports isDarkMode={isDarkMode} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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

  const modalStyles: React.CSSProperties = {
    '--modal-bg': isDarkMode ? '#222' : '#fff',
    '--modal-text': isDarkMode ? '#fff' : '#000',
  } as React.CSSProperties;

  const buttonContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '2vh',
    right: '2vw',
    display: 'flex',
    gap: '1vw',
    zIndex: 1000,
  };

  return (
    <>
      <div style={buttonContainerStyle}>
        <AnnouncementsButton
          onClick={() => setShowModal(true)}
          hasUnread={false}
        />
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      <AnimatedRoutes isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />

      <div
        className={`modal-backdrop ${showModal ? 'show' : 'hide'}`}
        onClick={() => setShowModal(false)}
      >
        <div
          className={`modal-content ${showModal ? 'modal-show' : ''}`}
          style={modalStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={() => setShowModal(false)}
          >
            ✖ Close
          </button>
          <h2>📣 Announcements</h2>

          {announcements.length > 0 ? (
            announcements.map(({ id, title, content, author, created_at }) => (
              <div
                key={id}
                className="modal-announcement"
                style={{
                  background: isDarkMode ? 'black' : 'white',
                  color: isDarkMode ? 'white' : 'black',
                }}
              >
                <h3>{title}</h3>
                <p>{content}</p>
                <small style={{ color: isDarkMode ? '#aaa' : '#444' }}>
                  By {author} — {new Date(created_at).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No current announcements.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
