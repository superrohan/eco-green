// ============================================
// ADMIN DASHBOARD COMPONENT
// ============================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_submissions: 0,
    total_co2_saved: '0g',
    average_eco_score: 0
  });
  const [challenges, setChallenges] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    challenge_id: '',
    title: '',
    description: '',
    role: 'developer',
    ideal_prompt: '',
    expected_result: '',
    difficulty_level: 'medium',
    eco_points_max: 100
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, challengesRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/challenges')
      ]);

      setStats(statsRes.data);
      setChallenges(challengesRes.data.challenges);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/admin/challenge/create', formData);
      setSuccess('Challenge created successfully! 🎉');
      setShowCreateForm(false);
      setFormData({
        challenge_id: '',
        title: '',
        description: '',
        role: 'developer',
        ideal_prompt: '',
        expected_result: '',
        difficulty_level: 'medium',
        eco_points_max: 100
      });
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create challenge');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="loading">⚙️ Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header eco-card">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <p className="page-subtitle">Manage challenges and monitor platform performance</p>
      </div>

      {/* Platform Statistics */}
      <section className="admin-stats-grid">
        <div className="stat-card eco-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total_users}</h3>
            <p className="stat-label">Total Users</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total_submissions}</h3>
            <p className="stat-label">Total Submissions</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total_co2_saved}</h3>
            <p className="stat-label">Total CO₂ Saved</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.average_eco_score}</h3>
            <p className="stat-label">Average Score</p>
          </div>
        </div>
      </section>

      {/* Create Challenge Button */}
      <section className="admin-actions">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="eco-button primary large"
        >
          {showCreateForm ? '✖ Cancel' : '➕ Create New Challenge'}
        </button>
      </section>

      {/* Create Challenge Form */}
      {showCreateForm && (
        <section className="create-challenge-form eco-card">
          <h2 className="section-title">Create New Challenge</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Challenge ID *</label>
                <input
                  type="text"
                  name="challenge_id"
                  value={formData.challenge_id}
                  onChange={handleChange}
                  placeholder="e.g., dev_005"
                  required
                  className="eco-input"
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="eco-input"
                  required
                >
                  <option value="developer">Developer</option>
                  <option value="business_analyst">Business Analyst</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="scrum_master">Scrum Master</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Challenge title"
                required
                className="eco-input"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the challenge"
                required
                rows="3"
                className="eco-textarea"
              />
            </div>

            <div className="form-group">
              <label>Ideal Prompt *</label>
              <textarea
                name="ideal_prompt"
                value={formData.ideal_prompt}
                onChange={handleChange}
                placeholder="The perfect prompt that users should aim for"
                required
                rows="4"
                className="eco-textarea"
              />
            </div>

            <div className="form-group">
              <label>Expected Result *</label>
              <textarea
                name="expected_result"
                value={formData.expected_result}
                onChange={handleChange}
                placeholder="What the ideal output should look like"
                required
                rows="4"
                className="eco-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Difficulty Level *</label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleChange}
                  className="eco-input"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="form-group">
                <label>Max Eco Points *</label>
                <input
                  type="number"
                  name="eco_points_max"
                  value={formData.eco_points_max}
                  onChange={handleChange}
                  min="50"
                  max="300"
                  required
                  className="eco-input"
                />
              </div>
            </div>

            <button type="submit" className="eco-button primary large">
              🚀 Create Challenge
            </button>
          </form>
        </section>
      )}

      {/* Existing Challenges */}
      <section className="challenges-management">
        <h2 className="section-title">📋 All Challenges ({challenges.length})</h2>
        <div className="challenges-table-container eco-card">
          <table className="challenges-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Role</th>
                <th>Difficulty</th>
                <th>Max Points</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td className="challenge-id">{challenge.challenge_id}</td>
                  <td className="challenge-title">{challenge.title}</td>
                  <td>
                    <span className="role-badge">{challenge.role}</span>
                  </td>
                  <td>
                    <span className={`difficulty-badge ${challenge.difficulty_level}`}>
                      {challenge.difficulty_level}
                    </span>
                  </td>
                  <td className="points">{challenge.eco_points_max}</td>
                  <td>
                    <span className={`status-badge ${challenge.is_active ? 'active' : 'inactive'}`}>
                      {challenge.is_active ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td className="date">
                    {new Date(challenge.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ============================================
// PROFILE COMPONENT
// ============================================
function Profile({ user, onUpdate }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, badges

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user/submissions');
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      developer: '💻',
      business_analyst: '📊',
      project_manager: '📋',
      scrum_master: '🏃'
    };
    return icons[role] || '👤';
  };

  const calculateStats = () => {
    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0
      ? (submissions.reduce((sum, s) => sum + s.eco_score, 0) / totalSubmissions).toFixed(1)
      : 0;
    const badgesEarned = submissions.filter(s => s.badge_earned).length;
    
    return { totalSubmissions, averageScore, badgesEarned };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="loading">👤 Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header eco-card eco-gradient">
        <div className="profile-avatar">
          <span className="avatar-icon">{getRoleIcon(user.role)}</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">
            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
        <div className="profile-rank">
          <div className="rank-badge">
            <span className="rank-label">Global Rank</span>
            <span className="rank-value">#{user.rank}</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="profile-stats-grid">
        <div className="stat-card eco-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-value">{user.eco_score}</h3>
            <p className="stat-label">Total Eco Score</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <h3 className="stat-value">{user.total_co2_saved}g</h3>
            <p className="stat-label">CO₂ Saved</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalSubmissions}</h3>
            <p className="stat-label">Submissions</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.averageScore}</h3>
            <p className="stat-label">Avg Score</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📝 Submissions
        </button>
        <button
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏅 Badges
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content eco-card">
            <h2 className="section-title">Your Journey 🌱</h2>
            <div className="journey-stats">
              <div className="journey-item">
                <span className="journey-icon">🎯</span>
                <div className="journey-details">
                  <h4>Challenges Completed</h4>
                  <p>{stats.totalSubmissions} challenges mastered</p>
                </div>
              </div>
              <div className="journey-item">
                <span className="journey-icon">🏆</span>
                <div className="journey-details">
                  <h4>Badges Earned</h4>
                  <p>{stats.badgesEarned} achievements unlocked</p>
                </div>
              </div>
              <div className="journey-item">
                <span className="journey-icon">📈</span>
                <div className="journey-details">
                  <h4>Performance</h4>
                  <p>Average score of {stats.averageScore}/100</p>
                </div>
              </div>
              <div className="journey-item">
                <span className="journey-icon">🌍</span>
                <div className="journey-details">
                  <h4>Environmental Impact</h4>
                  <p>You've saved {user.total_co2_saved}g of CO₂!</p>
                  <p className="impact-detail">
                    That's equivalent to {Math.floor(user.total_co2_saved / 0.02)} Google searches
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="submissions-content eco-card">
            <h2 className="section-title">Submission History</h2>
            {submissions.length > 0 ? (
              <div className="submissions-list">
                {submissions.map((submission) => (
                  <div key={submission.id} className="submission-item">
                    <div className="submission-header">
                      <h4 className="submission-title">{submission.challenge_title}</h4>
                      <span className={`score-badge score-${Math.floor(submission.eco_score / 10)}`}>
                        {submission.eco_score}/100
                      </span>
                    </div>
                    <div className="submission-meta">
                      <span>🌍 {submission.co2_saved} CO₂ saved</span>
                      <span>📅 {new Date(submission.submitted_at).toLocaleDateString()}</span>
                      {submission.badge_earned && (
                        <span className="badge-earned">🏅 {submission.badge_earned}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No submissions yet. Start your first challenge! 🚀</p>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="badges-content eco-card">
            <h2 className="section-title">Your Badges Collection 🏅</h2>
            {user.badges && user.badges.length > 0 ? (
              <div className="badges-showcase">
                {user.badges.map((badge, index) => (
                  <div key={index} className="badge-showcase-item">
                    <span className="badge-icon-large">{badge}</span>
                    <p className="badge-name">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-badges-message">
                <p>You haven't earned any badges yet! 🌱</p>
                <p>Complete challenges to unlock achievements.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { AdminDashboard, Profile };
