// ============================================
// LEADERBOARD COMPONENT
// ============================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard({ currentUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, developer, business_analyst, etc.

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/leaderboard');
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = filter === 'all' 
    ? leaderboard 
    : leaderboard.filter(user => user.role === filter);

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
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

  if (loading) {
    return <div className="loading">🏆 Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header eco-card">
        <h1 className="page-title">🏆 Global Leaderboard</h1>
        <p className="page-subtitle">Top performers in sustainable AI mastery</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          🌍 All
        </button>
        <button 
          className={`filter-button ${filter === 'developer' ? 'active' : ''}`}
          onClick={() => setFilter('developer')}
        >
          💻 Developers
        </button>
        <button 
          className={`filter-button ${filter === 'business_analyst' ? 'active' : ''}`}
          onClick={() => setFilter('business_analyst')}
        >
          📊 Analysts
        </button>
        <button 
          className={`filter-button ${filter === 'project_manager' ? 'active' : ''}`}
          onClick={() => setFilter('project_manager')}
        >
          📋 PMs
        </button>
        <button 
          className={`filter-button ${filter === 'scrum_master' ? 'active' : ''}`}
          onClick={() => setFilter('scrum_master')}
        >
          🏃 Scrum Masters
        </button>
      </div>

      {/* Top 3 Podium */}
      {filter === 'all' && leaderboard.length >= 3 && (
        <div className="podium-section">
          <div className="podium-container">
            {/* Second Place */}
            <div className="podium-item second-place">
              <div className="podium-user">
                <div className="podium-rank">🥈</div>
                <div className="podium-avatar">{getRoleIcon(leaderboard[1].role)}</div>
                <h3 className="podium-name">{leaderboard[1].username}</h3>
                <p className="podium-score">⭐ {leaderboard[1].eco_score}</p>
                <p className="podium-co2">🌍 {leaderboard[1].total_co2_saved}g saved</p>
              </div>
              <div className="podium-base second">2</div>
            </div>

            {/* First Place */}
            <div className="podium-item first-place">
              <div className="podium-user">
                <div className="podium-rank">🥇</div>
                <div className="podium-avatar champion">{getRoleIcon(leaderboard[0].role)}</div>
                <h3 className="podium-name">{leaderboard[0].username}</h3>
                <p className="podium-score">⭐ {leaderboard[0].eco_score}</p>
                <p className="podium-co2">🌍 {leaderboard[0].total_co2_saved}g saved</p>
              </div>
              <div className="podium-base first">1</div>
            </div>

            {/* Third Place */}
            <div className="podium-item third-place">
              <div className="podium-user">
                <div className="podium-rank">🥉</div>
                <div className="podium-avatar">{getRoleIcon(leaderboard[2].role)}</div>
                <h3 className="podium-name">{leaderboard[2].username}</h3>
                <p className="podium-score">⭐ {leaderboard[2].eco_score}</p>
                <p className="podium-co2">🌍 {leaderboard[2].total_co2_saved}g saved</p>
              </div>
              <div className="podium-base third">3</div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="leaderboard-table eco-card">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Role</th>
              <th>Eco Score</th>
              <th>CO₂ Saved</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((user, index) => (
              <tr 
                key={user.id} 
                className={user.id === currentUser.id ? 'current-user' : ''}
              >
                <td className="rank-cell">
                  <span className="rank-badge">{getRankMedal(user.rank)}</span>
                </td>
                <td className="user-cell">
                  <span className="user-name">{user.username}</span>
                  {user.id === currentUser.id && <span className="you-badge">You</span>}
                </td>
                <td className="role-cell">
                  <span className="role-icon">{getRoleIcon(user.role)}</span>
                  <span className="role-name">
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="score-cell">
                  <strong>{user.eco_score}</strong>
                </td>
                <td className="co2-cell">
                  {user.total_co2_saved}g
                </td>
                <td className="badges-cell">
                  {user.badges && user.badges.length > 0 ? (
                    <div className="badge-icons">
                      {user.badges.slice(0, 3).map((badge, idx) => (
                        <span key={idx} className="badge-icon" title={badge}>
                          {badge}
                        </span>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="badge-more">+{user.badges.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="no-badges">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeaderboard.length === 0 && (
          <div className="no-data">
            <p>No users found for this filter. 🌱</p>
          </div>
        )}
      </div>

      {/* Your Current Position (if not in top 10) */}
      {currentUser.rank > 10 && filter === 'all' && (
        <div className="your-position eco-card">
          <h3>Your Current Position</h3>
          <div className="position-details">
            <span className="position-rank">#{currentUser.rank}</span>
            <span className="position-score">⭐ {currentUser.eco_score}</span>
            <span className="position-co2">🌍 {currentUser.total_co2_saved}g saved</span>
          </div>
          <p className="position-message">
            Keep submitting challenges to climb the leaderboard! 🚀
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// CHALLENGE LIST COMPONENT
// ============================================
function ChallengeList({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, easy, medium, hard, expert

  useEffect(() => {
    fetchChallenges();
  }, [user.role]);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`/challenges/${user.role}`);
      setChallenges(response.data.challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = filter === 'all'
    ? challenges
    : challenges.filter(c => c.difficulty_level === filter);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#FF9800',
      expert: '#F44336'
    };
    return colors[difficulty] || '#757575';
  };

  if (loading) {
    return <div className="loading">🎯 Loading challenges...</div>;
  }

  return (
    <div className="challenge-list-container">
      <div className="challenges-header eco-card">
        <h1 className="page-title">🎯 Your Challenges</h1>
        <p className="page-subtitle">
          Master M365 Copilot through hands-on practice
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Levels
        </button>
        <button 
          className={`filter-button ${filter === 'easy' ? 'active' : ''}`}
          onClick={() => setFilter('easy')}
          style={{ borderColor: getDifficultyColor('easy') }}
        >
          ⭐ Easy
        </button>
        <button 
          className={`filter-button ${filter === 'medium' ? 'active' : ''}`}
          onClick={() => setFilter('medium')}
          style={{ borderColor: getDifficultyColor('medium') }}
        >
          ⭐⭐ Medium
        </button>
        <button 
          className={`filter-button ${filter === 'hard' ? 'active' : ''}`}
          onClick={() => setFilter('hard')}
          style={{ borderColor: getDifficultyColor('hard') }}
        >
          ⭐⭐⭐ Hard
        </button>
        <button 
          className={`filter-button ${filter === 'expert' ? 'active' : ''}`}
          onClick={() => setFilter('expert')}
          style={{ borderColor: getDifficultyColor('expert') }}
        >
          ⭐⭐⭐⭐ Expert
        </button>
      </div>

      {/* Challenge Grid */}
      <div className="challenges-grid">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <div key={challenge.challenge_id} className="challenge-card eco-card">
              <div className="challenge-header">
                <h3 className="challenge-title">{challenge.title}</h3>
                <span 
                  className={`difficulty-badge ${challenge.difficulty_level}`}
                  style={{ backgroundColor: getDifficultyColor(challenge.difficulty_level) }}
                >
                  {challenge.difficulty_level}
                </span>
              </div>

              <p className="challenge-description">{challenge.description}</p>

              <div className="challenge-footer">
                <div className="challenge-meta">
                  <span className="challenge-points">⭐ Up to {challenge.eco_points_max} points</span>
                  <span className="challenge-date">
                    Added {new Date(challenge.created_at).toLocaleDateString()}
                  </span>
                </div>
                <a 
                  href={`/challenge/${challenge.challenge_id}`}
                  className="eco-button primary"
                >
                  Start Challenge →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-challenges eco-card">
            <p>No challenges found for this difficulty level. 🌱</p>
            <button onClick={() => setFilter('all')} className="eco-button">
              View All Challenges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { Leaderboard, ChallengeList };
