import Auth from "Auth";
import Home from "Dashboard";
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "AuthContext";
import MenuBar from "MenuBar";
import Aides from "AidesTable";
import Availability from "Availability";
import Dashboard from "Dashboard";
import Evs from "Evs";
import AidesTable from "AidesTable";

export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
      <>
      <Router>
        <MenuBar />
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/events" element={isAuthenticated ? <Evs /> : <Navigate to="/login" />} />
        <Route path="/availability" element={isAuthenticated ? <Availability /> : <Navigate to="/login" />} />
        <Route path="/aides" element={isAuthenticated ? <AidesTable /> : <Navigate to="/login" />} />


        </Routes>
      </Router>
      </>
  );

}

