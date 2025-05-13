import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lunch from './pages/Lunch';
import Sports from './pages/Sports';
import DarkModeToggle from './components/home/DarkModeToggle';
import Footer from './components/home/Footer';

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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Update the body class when dark mode is toggled
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <Router basename="/rlclock">
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <AnimatedRoutes isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </Router>
  );
}

export default App;
