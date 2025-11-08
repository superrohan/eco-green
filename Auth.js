// ============================================
// LOGIN COMPONENT
// ============================================
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', formData);
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card eco-card">
        <div className="auth-header">
          <h1 className="eco-title">🌱 EcoPrompt Quest</h1>
          <p className="eco-subtitle">Master M365 Copilot & Save the Planet</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@company.com"
              className="eco-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="eco-input"
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" disabled={loading} className="eco-button primary">
            {loading ? '🌱 Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="eco-link">Join the Quest</Link></p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REGISTER COMPONENT
// ============================================
function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'developer', label: '👨‍💻 Developer', icon: '💻' },
    { value: 'business_analyst', label: '📊 Business Analyst', icon: '📈' },
    { value: 'project_manager', label: '📋 Project Manager', icon: '🎯' },
    { value: 'scrum_master', label: '🏃 Scrum Master', icon: '⚡' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      // Auto-login after registration
      const loginResponse = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      onRegister(loginResponse.data.token, loginResponse.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card eco-card register-card">
        <div className="auth-header">
          <h1 className="eco-title">🌿 Join EcoPrompt Quest</h1>
          <p className="eco-subtitle">Start your journey to sustainable AI mastery</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              className="eco-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@company.com"
              className="eco-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min. 6 characters"
              className="eco-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              className="eco-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Your Role</label>
            <div className="role-selector">
              {roles.map((role) => (
                <label key={role.value} className={`role-option ${formData.role === role.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                  />
                  <span className="role-icon">{role.icon}</span>
                  <span className="role-label">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button type="submit" disabled={loading} className="eco-button primary">
            {loading ? '🌱 Creating Account...' : '🚀 Start Your Quest'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="eco-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NAVIGATION COMPONENT
// ============================================
function Navigation({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleIcons = {
    developer: '💻',
    business_analyst: '📊',
    project_manager: '📋',
    scrum_master: '🏃'
  };

  return (
    <nav className="eco-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">🌱</span>
            <span className="brand-text">EcoPrompt Quest</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/dashboard" className="nav-link">
            🏠 Dashboard
          </Link>
          <Link to="/challenges" className="nav-link">
            🎯 Challenges
          </Link>
          <Link to="/leaderboard" className="nav-link">
            🏆 Leaderboard
          </Link>
          <Link to="/profile" className="nav-link">
            👤 Profile
          </Link>
          {user.is_admin && (
            <Link to="/admin" className="nav-link admin-link">
              ⚙️ Admin
            </Link>
          )}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-role-icon">{roleIcons[user.role] || '👤'}</span>
            <span className="user-name">{user.username}</span>
            <span className="user-score">⭐ {user.eco_score}</span>
          </div>
          <button onClick={onLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export { Login, Register, Navigation };
