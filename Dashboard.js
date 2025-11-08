// ============================================
// DASHBOARD COMPONENT
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    completedChallenges: 0,
    rank: user.rank || 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user.role]);

  const fetchDashboardData = async () => {
    try {
      const [challengesRes, submissionsRes] = await Promise.all([
        axios.get(`/challenges/${user.role}`),
        axios.get('/user/submissions')
      ]);

      setChallenges(challengesRes.data.challenges.slice(0, 3));
      setRecentSubmissions(submissionsRes.data.submissions.slice(0, 5));
      
      setStats({
        totalChallenges: challengesRes.data.challenges.length,
        completedChallenges: submissionsRes.data.submissions.length,
        rank: user.rank
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleGreeting = (role) => {
    const greetings = {
      developer: '💻 Ready to code efficiently?',
      business_analyst: '📊 Let\'s analyze with precision!',
      project_manager: '📋 Time to manage smartly!',
      scrum_master: '🏃 Sprint towards excellence!'
    };
    return greetings[role] || 'Welcome!';
  };

  if (loading) {
    return <div className="loading">🌱 Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="dashboard-hero eco-gradient">
        <h1 className="hero-title">Welcome back, {user.username}! 🌿</h1>
        <p className="hero-subtitle">{getRoleGreeting(user.role)}</p>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card eco-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-value">{user.eco_score}</h3>
            <p className="stat-label">Eco Score</p>
          </div>
        </div>

        <div className="stat-card eco-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-value">#{stats.rank}</h3>
            <p className="stat-label">Global Rank</p>
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
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.completedChallenges}/{stats.totalChallenges}</h3>
            <p className="stat-label">Challenges</p>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      {user.badges && user.badges.length > 0 && (
        <section className="badges-section eco-card">
          <h2 className="section-title">🏅 Your Badges</h2>
          <div className="badges-grid">
            {user.badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <span className="badge-emoji">{badge}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Challenges */}
      <section className="challenges-section">
        <div className="section-header">
          <h2 className="section-title">🎯 Today's Challenges</h2>
          <Link to="/challenges" className="view-all-link">View All →</Link>
        </div>

        <div className="challenges-grid">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <div key={challenge.challenge_id} className="challenge-card eco-card">
                <div className="challenge-header">
                  <h3 className="challenge-title">{challenge.title}</h3>
                  <span className={`difficulty-badge ${challenge.difficulty_level}`}>
                    {challenge.difficulty_level}
                  </span>
                </div>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-footer">
                  <span className="challenge-points">⭐ {challenge.eco_points_max} points</span>
                  <Link to={`/challenge/${challenge.challenge_id}`} className="eco-button small">
                    Start Challenge →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No challenges available. Check back soon! 🌱</p>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity eco-card">
        <h2 className="section-title">📈 Recent Activity</h2>
        {recentSubmissions.length > 0 ? (
          <div className="activity-list">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="activity-item">
                <div className="activity-icon">
                  {submission.eco_score >= 90 ? '🌟' : 
                   submission.eco_score >= 70 ? '⭐' : 
                   submission.eco_score >= 50 ? '✨' : '📝'}
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">{submission.challenge_title}</h4>
                  <p className="activity-meta">
                    Score: {submission.eco_score} • CO₂ Saved: {submission.co2_saved}
                    {submission.badge_earned && ` • Badge: ${submission.badge_earned}`}
                  </p>
                </div>
                <span className="activity-date">
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No submissions yet. Start your first challenge! 🚀</p>
        )}
      </section>

      {/* CO₂ Impact Visualization */}
      <section className="impact-section eco-card eco-gradient-light">
        <h2 className="section-title">🌍 Your Environmental Impact</h2>
        <div className="impact-content">
          <div className="impact-visual">
            <div className="tree-icon">🌳</div>
            <p className="impact-text">
              Your efficient prompting has saved <strong>{user.total_co2_saved}g</strong> of CO₂
            </p>
          </div>
          <div className="impact-equivalents">
            <div className="equivalent-item">
              <span className="equivalent-icon">🔍</span>
              <span className="equivalent-text">
                = {Math.floor((user.total_co2_saved || 0) / 0.02)} Google searches
              </span>
            </div>
            <div className="equivalent-item">
              <span className="equivalent-icon">💡</span>
              <span className="equivalent-text">
                = {Math.floor((user.total_co2_saved || 0) / 0.1)} minutes of LED bulb usage
              </span>
            </div>
            <div className="equivalent-item">
              <span className="equivalent-icon">💻</span>
              <span className="equivalent-text">
                = {Math.floor((user.total_co2_saved || 0) / 0.05)} minutes of laptop charging
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
