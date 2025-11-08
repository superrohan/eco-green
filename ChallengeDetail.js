// ============================================
// CHALLENGE DETAIL COMPONENT
// Submit prompts and receive AI evaluation
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChallengeDetail.css';

function ChallengeDetail({ user, onScoreUpdate }) {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [formData, setFormData] = useState({
    user_prompt: '',
    copilot_result: ''
  });
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChallenge();
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const response = await axios.get(`/challenge/${challengeId}`);
      setChallenge(response.data);
    } catch (err) {
      setError('Failed to load challenge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setEvaluation(null);

    try {
      const response = await axios.post('/challenge/submit', {
        challenge_id: challengeId,
        user_prompt: formData.user_prompt,
        copilot_result: formData.copilot_result
      });

      setEvaluation(response.data);
      onScoreUpdate(); // Update user profile with new score

      // Clear form after successful submission
      setFormData({ user_prompt: '', copilot_result: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50'; // Green
    if (score >= 70) return '#8BC34A'; // Light Green
    if (score >= 50) return '#FFC107'; // Amber
    return '#FF5722'; // Red
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟';
    if (score >= 70) return '⭐';
    if (score >= 50) return '✨';
    return '📝';
  };

  if (loading) {
    return <div className="loading">🌱 Loading challenge...</div>;
  }

  if (!challenge) {
    return (
      <div className="error-container">
        <h2>Challenge not found</h2>
        <button onClick={() => navigate('/challenges')} className="eco-button">
          ← Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="challenge-detail-container">
      {/* Challenge Header */}
      <div className="challenge-header-section eco-card">
        <button onClick={() => navigate('/challenges')} className="back-button">
          ← Back
        </button>
        <h1 className="challenge-title">{challenge.title}</h1>
        <div className="challenge-meta">
          <span className={`difficulty-badge ${challenge.difficulty_level}`}>
            {challenge.difficulty_level}
          </span>
          <span className="points-badge">⭐ {challenge.eco_points_max} points max</span>
        </div>
        <p className="challenge-description">{challenge.description}</p>
      </div>

      {/* Submission Form */}
      <div className="submission-section eco-card">
        <h2 className="section-title">🎯 Your Submission</h2>
        <form onSubmit={handleSubmit} className="submission-form">
          <div className="form-group">
            <label htmlFor="user_prompt">
              Your Prompt for M365 Copilot
              <span className="label-hint">Write the prompt you used in Microsoft 365 Copilot</span>
            </label>
            <textarea
              id="user_prompt"
              name="user_prompt"
              value={formData.user_prompt}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Example: You are a senior developer. Create API documentation for the following endpoints..."
              className="eco-textarea"
            />
            <div className="char-count">{formData.user_prompt.length} characters</div>
          </div>

          <div className="form-group">
            <label htmlFor="copilot_result">
              Copilot's Result
              <span className="label-hint">Paste the output you received from Copilot</span>
            </label>
            <textarea
              id="copilot_result"
              name="copilot_result"
              value={formData.copilot_result}
              onChange={handleChange}
              required
              rows="8"
              placeholder="Paste the output from Microsoft 365 Copilot here..."
              className="eco-textarea"
            />
            <div className="char-count">{formData.copilot_result.length} characters</div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button 
            type="submit" 
            disabled={submitting || !formData.user_prompt || !formData.copilot_result}
            className="eco-button primary large"
          >
            {submitting ? '🌱 Evaluating...' : '🚀 Submit for Evaluation'}
          </button>
        </form>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="evaluation-section">
          {/* Score Card */}
          <div className="score-card eco-card" style={{ borderColor: getScoreColor(evaluation.eco_score) }}>
            <div className="score-header">
              <h2 className="score-title">
                {getScoreEmoji(evaluation.eco_score)} Your Eco Score
              </h2>
            </div>
            <div className="score-display">
              <div 
                className="score-circle" 
                style={{ borderColor: getScoreColor(evaluation.eco_score) }}
              >
                <span className="score-value" style={{ color: getScoreColor(evaluation.eco_score) }}>
                  {evaluation.eco_score}
                </span>
                <span className="score-max">/100</span>
              </div>
            </div>
            <div className="score-details">
              <div className="score-detail-item">
                <span className="detail-icon">🌍</span>
                <span className="detail-label">CO₂ Saved:</span>
                <span className="detail-value">{evaluation.co2_saved}</span>
              </div>
              {evaluation.badge_earned && (
                <div className="score-detail-item badge-earned-highlight">
                  <span className="detail-icon">🏅</span>
                  <span className="detail-label">Badge Earned:</span>
                  <span className="detail-value">{evaluation.badge_earned}</span>
                </div>
              )}
              {evaluation.leaderboard_update && (
                <div className="score-detail-item">
                  <span className="detail-icon">📈</span>
                  <span className="detail-label">Rank Change:</span>
                  <span className={`detail-value ${evaluation.leaderboard_update.rank_change.startsWith('+') ? 'positive' : ''}`}>
                    {evaluation.leaderboard_update.rank_change} (Now #{evaluation.leaderboard_update.new_rank})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation Summary */}
          <div className="evaluation-card eco-card">
            <h3 className="evaluation-heading">📝 Evaluation Summary</h3>
            <p className="evaluation-text">{evaluation.evaluation_summary}</p>
          </div>

          {/* Optimized Prompt */}
          <div className="evaluation-card eco-card optimized-prompt">
            <h3 className="evaluation-heading">✨ Optimized Prompt</h3>
            <div className="code-block">
              <pre>{evaluation.optimized_prompt}</pre>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(evaluation.optimized_prompt)}
              className="copy-button eco-button small"
            >
              📋 Copy to Clipboard
            </button>
          </div>

          {/* Learning Point */}
          <div className="evaluation-card eco-card learning-section">
            <h3 className="evaluation-heading">💡 Key Learning</h3>
            <p className="learning-text">{evaluation.learning_point}</p>
          </div>

          {/* Improvement Areas */}
          {evaluation.improvement_areas && evaluation.improvement_areas.length > 0 && (
            <div className="evaluation-card eco-card">
              <h3 className="evaluation-heading">🎯 Areas to Improve</h3>
              <ul className="improvement-list">
                {evaluation.improvement_areas.map((area, index) => (
                  <li key={index} className="improvement-item">
                    <span className="improvement-icon">→</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={() => {
                setEvaluation(null);
                setFormData({ user_prompt: '', copilot_result: '' });
              }}
              className="eco-button secondary"
            >
              🔄 Try Again
            </button>
            <button 
              onClick={() => navigate('/challenges')}
              className="eco-button primary"
            >
              🎯 Next Challenge
            </button>
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      {!evaluation && (
        <div className="tips-section eco-card eco-gradient-light">
          <h3 className="tips-title">💡 Tips for Better Prompts</h3>
          <ul className="tips-list">
            <li>✅ Define a clear role (e.g., "You are a senior developer...")</li>
            <li>✅ Be specific about output format and structure</li>
            <li>✅ Provide context and examples when relevant</li>
            <li>✅ Include constraints and requirements explicitly</li>
            <li>✅ Use step-by-step instructions for complex tasks</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ChallengeDetail;
