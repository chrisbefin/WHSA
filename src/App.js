import Auth from "Auth";
import Home from "Home";
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "AuthContext";


export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
      <Router>
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Auth />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
  );

}

