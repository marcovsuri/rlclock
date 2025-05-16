import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lunch from './pages/Lunch';
import Sports from './pages/Sports';
import DarkModeToggle from './components/home/DarkModeToggle';
import Footer from './components/home/Footer';
import './styles.css';
import getAnnouncements from './core/announcementsFetcher';
import AnnouncementsButton from './components/home/AnnouncementsButton';
import { Announcement } from './types/announcements';

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
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
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

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
            style={{
              // Optional CSS variable override based on dark mode
              ['--modal-bg' as any]: isDarkMode ? '#222' : '#fff',
              ['--modal-text' as any]: isDarkMode ? '#fff' : '#000',
            }}
          >
            <h2>📣 Announcements</h2>

            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="modal-announcement"
                  style={{
                    ['--announcement-bg' as any]: isDarkMode
                      ? 'black'
                      : 'white',
                    color: isDarkMode ? 'white' : 'black',
                  }}
                >
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <small style={{ color: isDarkMode ? '#aaa' : '#444' }}>
                    By {announcement.author} —{' '}
                    {new Date(announcement.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p>No announcements available.</p>
            )}

            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
