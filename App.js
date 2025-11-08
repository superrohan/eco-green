// ============================================
// ECOPROMPT QUEST - REACT FRONTEND
// Main App Component with Routing
// ============================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ChallengeList from './components/ChallengeList';
import ChallengeDetail from './components/ChallengeDetail';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Navigation from './components/Navigation';

// Styling
import './App.css';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios default configuration
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Set axios default auth header
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="eco-spinner">🌱</div>
        <p>Loading EcoPrompt Quest...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container eco-theme">
        {user && <Navigation user={user} onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/dashboard" />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/challenges" 
              element={user ? <ChallengeList user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/challenge/:challengeId" 
              element={user ? <ChallengeDetail user={user} onScoreUpdate={fetchUserProfile} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/leaderboard" 
              element={user ? <Leaderboard currentUser={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} onUpdate={fetchUserProfile} /> : <Navigate to="/login" />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={user && user.is_admin ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>

        {/* Eco Footer */}
        {user && (
          <footer className="eco-footer">
            <div className="co2-tracker">
              🌍 Total CO₂ Saved: <strong>{user.total_co2_saved || 0}g</strong>
              <span className="eco-tip"> = {Math.floor((user.total_co2_saved || 0) / 0.02)} Google searches avoided!</span>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
