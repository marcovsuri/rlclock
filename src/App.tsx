import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lunch from "./pages/Lunch";
import Sports from "./pages/Sports";
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lunch" element={<Lunch />} />
        <Route path="/sports" element={<Sports />} />
      </Routes>
    </Router>
  );
}

export default App;
