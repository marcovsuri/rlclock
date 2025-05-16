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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
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

  const buttonContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '2vh',
    right: '2vw',
    display: 'flex',
    gap: '1vw',
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

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)} // close on background click
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
            style={{
              backgroundColor: isDarkMode ? '#222' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            <h2>📣 Announcements</h2>
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    background: isDarkMode ? '#333' : '#f9f9f9',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem' }}>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <small>
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
                marginTop: '1rem',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
