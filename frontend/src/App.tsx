import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Lunch from "./pages/Lunch";
import Sports from "./pages/Sports";
import { DayTypeProvider } from "./components/contexts/DayTypeContext";

import "./styles.css";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <DayTypeProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/lunch" element={<Lunch />} />
          <Route path="/sports" element={<Sports />} />
        </Routes>
      </AnimatePresence>
    </DayTypeProvider>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
