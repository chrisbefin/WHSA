import Auth from "Auth";
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "AuthContext";
import MenuBar from "MenuBar";
import Availability from "Availability";
import Evs from "EventsTable";
import AidesTable from "AidesTable";
import TestDash from "TestDash";
import Admin from "Admin";

export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
      <>
      <Router>
        <MenuBar />
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={isAuthenticated ? <TestDash /> : <Navigate to="/login" />} />
        <Route path="/events" element={isAuthenticated ? <Evs /> : <Navigate to="/login" />} />
        <Route path="/availability" element={isAuthenticated ? <Availability /> : <Navigate to="/login" />} />
        <Route path="/aides" element={isAuthenticated ? <AidesTable /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
      </>
  );

}

