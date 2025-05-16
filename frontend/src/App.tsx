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

  const fetchAnnouncements = async () => {
    try {
      const result = await getAnnouncements();
      if (result.success) {
        setAnnouncements(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleAnnouncementsClick = async () => {
    await fetchAnnouncements();
    setShowModal(true);
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
          onClick={handleAnnouncementsClick}
          hasUnread={true}
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
            style={{
              backgroundColor: isDarkMode ? '#222' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              padding: '2rem',
              borderRadius: '16px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontSize: '1rem',
              width: '600px',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                color: 'rgb(154, 31, 54)',
                marginBottom: '1.5rem',
                fontWeight: 600,
                borderBottom: '1px solid rgba(154, 31, 54, 0.4)',
                paddingBottom: '0.5rem',
                textAlign: 'center',
              }}
            >
              📣 Announcements
            </h2>
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    marginBottom: '1.5rem',
                    padding: '2rem',
                    borderRadius: '2vw',
                    backgroundColor: isDarkMode ? 'black' : 'white',
                    color: 'rgb(154, 31, 54)',
                    boxShadow: '0 4px 20px rgba(154, 31, 54, 0.5)',
                    transition: 'background-color 3s ease, color 3s ease',
                    textAlign: 'left',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: '0.5rem',
                      fontSize: '1.5rem',
                      color: isDarkMode ? 'white' : 'black',
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {announcement.title}
                  </h3>
                  <p
                    style={{
                      marginBottom: '1rem',
                      fontSize: '1rem',
                      color: isDarkMode ? 'white' : 'black',
                    }}
                  >
                    {announcement.content}
                  </p>
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
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.8vh 1.5vw',
                borderRadius: '12px',
                border: '1px solid rgba(154, 31, 54, 0.2)',
                backgroundColor: 'rgba(154, 31, 54, 0.1)',
                color: 'rgba(154, 31, 54, 1)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(154, 31, 54, 0.2)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 6px 12px rgba(154, 31, 54, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 2px 6px rgba(154, 31, 54, 0.2)';
              }}
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
