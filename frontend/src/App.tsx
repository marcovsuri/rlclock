import React from 'react';
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

import './styles.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/lunch" element={<Lunch />} />
        <Route path="/sports" element={<Sports />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router basename="/rlclock">
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
