# 🏅 EcoPrompt Quest - Score-Based Badge System
## Complete Badge Logic & Implementation

---

## 🎯 Badge System Overview

Badges are awarded based on **total accumulated eco_score**, not individual submission scores.
Users earn badges as they reach score milestones and keep all earned badges permanently.

---

## 🏆 Badge Tier System

### Tier 1: Beginner Badges (0-500 points)
| Score Threshold | Badge Name | Emoji | Description |
|----------------|------------|-------|-------------|
| 50 | First Steps | 🌱 | Complete your first challenge |
| 100 | Seedling | 🌿 | You're growing! |
| 250 | Green Learner | 🍃 | Making progress |
| 500 | Eco Novice | 🌾 | Solid foundation |

### Tier 2: Intermediate Badges (500-2000 points)
| Score Threshold | Badge Name | Emoji | Description |
|----------------|------------|-------|-------------|
| 750 | Prompt Apprentice | 🌳 | Getting better |
| 1000 | Green Expert | 🌲 | You know your stuff |
| 1500 | Eco Warrior | 🌴 | Making real impact |
| 2000 | Sustainability Champion | 🎋 | Outstanding work |

### Tier 3: Advanced Badges (2000-5000 points)
| Score Threshold | Badge Name | Emoji | Description |
|----------------|------------|-------|-------------|
| 2500 | Master Prompter | 🌺 | Elite level |
| 3000 | Green Guru | 🌸 | Exceptional skill |
| 4000 | Eco Legend | 🌼 | Legendary status |
| 5000 | Planet Protector | 🌻 | World-class |

### Tier 4: Elite Badges (5000+ points)
| Score Threshold | Badge Name | Emoji | Description |
|----------------|------------|-------|-------------|
| 7500 | Carbon Crusader | 🏵️ | Extraordinary |
| 10000 | Sustainability Sage | 🌹 | Mastery achieved |
| 15000 | Eco Champion | 🌷 | Among the best |
| 20000 | Green Legend | 💐 | Ultimate achievement |

### Special Achievement Badges
| Criteria | Badge Name | Emoji | Description |
|----------|------------|-------|-------------|
| 10 perfect scores (95+) | Perfectionist | ⭐ | Excellence streak |
| 50 challenges completed | Dedicated Learner | 📚 | Commitment |
| 100 challenges completed | Challenge Master | 🎯 | Prolific |
| Save 10g CO₂ | Eco Saver | 💚 | Environmental impact |
| Save 50g CO₂ | Climate Hero | 🌍 | Major impact |
| Top 10 leaderboard | Elite Performer | 🏆 | Top tier |
| Top 3 leaderboard | Podium Finisher | 🥇 | Best of the best |

---

## 💻 Backend Implementation

### Step 1: Badge Configuration

Add to your backend (after imports):

```javascript
// ============================================
// BADGE SYSTEM CONFIGURATION
// ============================================

const BADGE_TIERS = [
  // Tier 1: Beginner
  { threshold: 50, name: "First Steps", emoji: "🌱", tier: 1 },
  { threshold: 100, name: "Seedling", emoji: "🌿", tier: 1 },
  { threshold: 250, name: "Green Learner", emoji: "🍃", tier: 1 },
  { threshold: 500, name: "Eco Novice", emoji: "🌾", tier: 1 },
  
  // Tier 2: Intermediate
  { threshold: 750, name: "Prompt Apprentice", emoji: "🌳", tier: 2 },
  { threshold: 1000, name: "Green Expert", emoji: "🌲", tier: 2 },
  { threshold: 1500, name: "Eco Warrior", emoji: "🌴", tier: 2 },
  { threshold: 2000, name: "Sustainability Champion", emoji: "🎋", tier: 2 },
  
  // Tier 3: Advanced
  { threshold: 2500, name: "Master Prompter", emoji: "🌺", tier: 3 },
  { threshold: 3000, name: "Green Guru", emoji: "🌸", tier: 3 },
  { threshold: 4000, name: "Eco Legend", emoji: "🌼", tier: 3 },
  { threshold: 5000, name: "Planet Protector", emoji: "🌻", tier: 3 },
  
  // Tier 4: Elite
  { threshold: 7500, name: "Carbon Crusader", emoji: "🏵️", tier: 4 },
  { threshold: 10000, name: "Sustainability Sage", emoji: "🌹", tier: 4 },
  { threshold: 15000, name: "Eco Champion", emoji: "🌷", tier: 4 },
  { threshold: 20000, name: "Green Legend", emoji: "💐", tier: 4 }
];

// ============================================
// BADGE CALCULATION FUNCTION
// ============================================

function calculateBadges(totalScore, userStats) {
  const earnedBadges = [];
  
  // 1. Score-based badges (main progression)
  BADGE_TIERS.forEach(badge => {
    if (totalScore >= badge.threshold) {
      earnedBadges.push(`${badge.emoji} ${badge.name}`);
    }
  });
  
  // 2. Special achievement badges
  if (userStats.perfectScores >= 10) {
    earnedBadges.push("⭐ Perfectionist");
  }
  
  if (userStats.totalSubmissions >= 50) {
    earnedBadges.push("📚 Dedicated Learner");
  }
  
  if (userStats.totalSubmissions >= 100) {
    earnedBadges.push("🎯 Challenge Master");
  }
  
  if (userStats.totalCO2Saved >= 10) {
    earnedBadges.push("💚 Eco Saver");
  }
  
  if (userStats.totalCO2Saved >= 50) {
    earnedBadges.push("🌍 Climate Hero");
  }
  
  if (userStats.rank <= 10) {
    earnedBadges.push("🏆 Elite Performer");
  }
  
  if (userStats.rank <= 3) {
    earnedBadges.push("🥇 Podium Finisher");
  }
  
  return earnedBadges;
}

// ============================================
// GET NEWLY EARNED BADGE
// ============================================

function getNewlyEarnedBadge(oldScore, newScore, currentBadges) {
  // Find the highest badge threshold the user just crossed
  const newBadge = BADGE_TIERS
    .filter(badge => oldScore < badge.threshold && newScore >= badge.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];
  
  if (newBadge) {
    const badgeString = `${newBadge.emoji} ${newBadge.name}`;
    
    // Check if user already has this badge
    if (!currentBadges.includes(badgeString)) {
      return badgeString;
    }
  }
  
  return null;
}
```

### Step 2: Update Challenge Submission Route

Replace your existing `/api/challenge/submit` route with this:

```javascript
// ============================================
// FIXED: CHALLENGE SUBMISSION WITH BADGE SYSTEM
// ============================================

app.post('/api/challenge/submit', authenticateToken, async (req, res) => {
  try {
    const { challenge_id, user_prompt, copilot_result } = req.body;
    const userId = req.user.id;

    // Fetch challenge details
    const challengeResult = await pool.query(
      `SELECT * FROM challenges WHERE challenge_id = $1`,
      [challenge_id]
    );

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challengeResult.rows[0];

    // Get user's current stats BEFORE submission
    const userStatsResult = await pool.query(
      `SELECT eco_score, badges, 
              (SELECT COUNT(*) FROM submissions WHERE user_id = $1 AND eco_score >= 95) as perfect_scores,
              (SELECT COUNT(*) FROM submissions WHERE user_id = $1) as total_submissions,
              total_co2_saved
       FROM users WHERE id = $1`,
      [userId]
    );

    const oldUserStats = userStatsResult.rows[0];
    const oldScore = oldUserStats.eco_score;
    const oldBadges = oldUserStats.badges || [];

    // ============================================
    // AI EVALUATION (Remove badge_earned from here)
    // ============================================
    
    const evaluationPrompt = `
You are an expert prompt engineering evaluator for "EcoPrompt Quest".

Challenge: ${challenge.title}
User Prompt: "${user_prompt}"
Copilot Result: "${copilot_result}"
Ideal Prompt: ${challenge.ideal_prompt}

Evaluate and respond in JSON format with:
{
  "evaluation_summary": "2-3 sentence evaluation",
  "optimized_prompt": "improved prompt",
  "learning_point": "educational explanation",
  "eco_score": 0-100,
  "co2_saved": "0.20g",
  "improvement_areas": ["area1", "area2"]
}

DO NOT include badge_earned field. Badges are calculated separately based on total score.
`;

    let evaluation;

    try {
      const messages = [
        {
          role: "system",
          content: "You are a prompt engineering evaluator. Respond only with valid JSON. Do not include badge_earned."
        },
        {
          role: "user",
          content: evaluationPrompt
        }
      ];

      const result = await callAzureOpenAIWithRetry(messages);
      const responseContent = result.choices[0].message.content;
      
      const cleanedResponse = responseContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      evaluation = JSON.parse(cleanedResponse);

    } catch (azureError) {
      console.error('Azure OpenAI failed, using fallback:', azureError.message);
      evaluation = generateFallbackEvaluation(user_prompt, copilot_result, challenge);
    }

    // Remove badge_earned if AI mistakenly included it
    delete evaluation.badge_earned;

    // Calculate new total score
    const newScore = oldScore + evaluation.eco_score;
    const co2Value = parseFloat(evaluation.co2_saved.replace('g', ''));
    const newCO2Total = oldUserStats.total_co2_saved + co2Value;

    // ============================================
    // CALCULATE NEW BADGES BASED ON SCORE
    // ============================================
    
    const newUserStats = {
      totalScore: newScore,
      perfectScores: oldUserStats.perfect_scores + (evaluation.eco_score >= 95 ? 1 : 0),
      totalSubmissions: oldUserStats.total_submissions + 1,
      totalCO2Saved: newCO2Total,
      rank: 0 // Will be calculated later
    };

    // Get all badges user should have
    const allEarnedBadges = calculateBadges(newScore, newUserStats);

    // Find newly earned badge (for this submission only)
    const newlyEarnedBadge = getNewlyEarnedBadge(oldScore, newScore, oldBadges);

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    
    const submissionResult = await pool.query(
      `INSERT INTO submissions 
       (user_id, challenge_id, user_prompt, copilot_result, eco_score, co2_saved, 
        evaluation_summary, optimized_prompt, learning_point, badge_earned, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING id`,
      [
        userId, challenge_id, user_prompt, copilot_result,
        evaluation.eco_score, evaluation.co2_saved,
        evaluation.evaluation_summary, evaluation.optimized_prompt,
        evaluation.learning_point, newlyEarnedBadge // Only the NEW badge for this submission
      ]
    );

    // ============================================
    // UPDATE USER WITH ALL BADGES
    // ============================================
    
    await pool.query(
      `UPDATE users 
       SET eco_score = $1, 
           total_co2_saved = $2,
           badges = $3
       WHERE id = $4`,
      [newScore, newCO2Total, allEarnedBadges, userId]
    );

    // ============================================
    // CALCULATE RANK
    // ============================================
    
    const rankResult = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM users WHERE eco_score > u.eco_score) + 1 as new_rank,
         u.rank as old_rank
       FROM users u WHERE u.id = $1`,
      [userId]
    );

    const newRank = rankResult.rows[0].new_rank;
    const oldRank = rankResult.rows[0].old_rank;
    const rankChange = oldRank - newRank;

    await pool.query('UPDATE users SET rank = $1 WHERE id = $2', [newRank, userId]);

    // Check if rank-based badges should be awarded
    if (newRank <= 3 && !allEarnedBadges.includes("🥇 Podium Finisher")) {
      allEarnedBadges.push("🥇 Podium Finisher");
      await pool.query('UPDATE users SET badges = $1 WHERE id = $2', [allEarnedBadges, userId]);
    } else if (newRank <= 10 && !allEarnedBadges.includes("🏆 Elite Performer")) {
      allEarnedBadges.push("🏆 Elite Performer");
      await pool.query('UPDATE users SET badges = $1 WHERE id = $2', [allEarnedBadges, userId]);
    }

    // ============================================
    // RETURN RESPONSE
    // ============================================
    
    res.json({
      submission_id: submissionResult.rows[0].id,
      evaluation_summary: evaluation.evaluation_summary,
      optimized_prompt: evaluation.optimized_prompt,
      learning_point: evaluation.learning_point,
      eco_score: evaluation.eco_score,
      co2_saved: evaluation.co2_saved,
      improvement_areas: evaluation.improvement_areas,
      badge_earned: newlyEarnedBadge, // Only the NEW badge
      total_score: newScore,
      total_badges: allEarnedBadges.length,
      all_badges: allEarnedBadges, // All badges user has earned
      leaderboard_update: {
        rank_change: rankChange > 0 ? `+${rankChange}` : rankChange.toString(),
        new_rank: newRank
      }
    });

  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ 
      error: 'Evaluation failed', 
      details: error.message 
    });
  }
});
```

### Step 3: Add Badge Progress Endpoint

```javascript
// ============================================
// GET USER'S BADGE PROGRESS
// ============================================

app.get('/api/user/badge-progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      `SELECT eco_score, badges, rank,
              (SELECT COUNT(*) FROM submissions WHERE user_id = $1 AND eco_score >= 95) as perfect_scores,
              (SELECT COUNT(*) FROM submissions WHERE user_id = $1) as total_submissions,
              total_co2_saved
       FROM users WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];
    const currentScore = user.eco_score;

    // Find current tier
    const currentBadges = BADGE_TIERS.filter(b => currentScore >= b.threshold);
    const currentTier = currentBadges.length > 0 
      ? currentBadges[currentBadges.length - 1] 
      : null;

    // Find next badge
    const nextBadge = BADGE_TIERS.find(b => currentScore < b.threshold);

    // Calculate progress to next badge
    const progressToNext = nextBadge 
      ? {
          current: currentScore,
          required: nextBadge.threshold,
          remaining: nextBadge.threshold - currentScore,
          percentage: Math.round((currentScore / nextBadge.threshold) * 100),
          nextBadge: `${nextBadge.emoji} ${nextBadge.name}`
        }
      : null;

    // Get all earned badges
    const allBadges = calculateBadges(currentScore, {
      perfectScores: user.perfect_scores,
      totalSubmissions: user.total_submissions,
      totalCO2Saved: user.total_co2_saved,
      rank: user.rank
    });

    // Get special achievements progress
    const specialAchievements = [
      {
        name: "Perfectionist",
        emoji: "⭐",
        current: user.perfect_scores,
        required: 10,
        earned: user.perfect_scores >= 10
      },
      {
        name: "Dedicated Learner",
        emoji: "📚",
        current: user.total_submissions,
        required: 50,
        earned: user.total_submissions >= 50
      },
      {
        name: "Challenge Master",
        emoji: "🎯",
        current: user.total_submissions,
        required: 100,
        earned: user.total_submissions >= 100
      },
      {
        name: "Eco Saver",
        emoji: "💚",
        current: user.total_co2_saved,
        required: 10,
        earned: user.total_co2_saved >= 10
      },
      {
        name: "Climate Hero",
        emoji: "🌍",
        current: user.total_co2_saved,
        required: 50,
        earned: user.total_co2_saved >= 50
      }
    ];

    res.json({
      current_score: currentScore,
      current_tier: currentTier,
      next_badge: progressToNext,
      earned_badges: allBadges,
      total_badges: allBadges.length,
      special_achievements: specialAchievements,
      tier_progress: {
        tier_1: BADGE_TIERS.filter(b => b.tier === 1 && currentScore >= b.threshold).length,
        tier_2: BADGE_TIERS.filter(b => b.tier === 2 && currentScore >= b.threshold).length,
        tier_3: BADGE_TIERS.filter(b => b.tier === 3 && currentScore >= b.threshold).length,
        tier_4: BADGE_TIERS.filter(b => b.tier === 4 && currentScore >= b.threshold).length
      }
    });

  } catch (error) {
    console.error('Badge Progress Error:', error);
    res.status(500).json({ error: 'Failed to fetch badge progress' });
  }
});
```

### Step 4: Update Fallback Evaluation

```javascript
// ============================================
// UPDATED FALLBACK EVALUATION (NO BADGES)
// ============================================

function generateFallbackEvaluation(userPrompt, copilotResult, challenge) {
  console.log('📝 Generating fallback evaluation...');
  
  const promptLength = userPrompt.length;
  const hasRole = /you are|act as|as a/i.test(userPrompt);
  const hasContext = userPrompt.length > 50;
  const hasSpecifics = /specific|detail|example|format/i.test(userPrompt);
  
  let score = 50;
  if (hasRole) score += 15;
  if (hasContext) score += 15;
  if (hasSpecifics) score += 10;
  if (promptLength > 100) score += 10;
  score = Math.min(score, 95);
  
  const co2Saved = score >= 90 ? "0.28g" : 
                   score >= 70 ? "0.20g" : 
                   score >= 50 ? "0.10g" : "0.03g";
  
  return {
    evaluation_summary: hasRole 
      ? "Good start with role definition. Consider adding more specific requirements and output format details."
      : "Your prompt could benefit from defining a role context and being more specific about desired outputs.",
    optimized_prompt: `You are a ${challenge.role}. ${challenge.ideal_prompt}`,
    learning_point: "Effective prompts include: 1) Role definition, 2) Clear context, 3) Specific output format, and 4) Examples. These elements help AI generate more accurate responses.",
    eco_score: score,
    co2_saved: co2Saved,
    // NO badge_earned - calculated separately
    improvement_areas: [
      !hasRole ? "Add role context" : null,
      !hasSpecifics ? "Specify output format" : null,
      promptLength < 50 ? "Provide more details" : null
    ].filter(Boolean)
  };
}
```

---

## 🎨 Frontend Updates

### Update ChallengeDetail Component

```javascript
// In ChallengeDetail.js - Update the evaluation display

{evaluation && (
  <div className="evaluation-section">
    {/* Score Card */}
    <div className="score-card">
      {/* ... score display ... */}
      
      {/* Show newly earned badge */}
      {evaluation.badge_earned && (
        <div className="new-badge-earned">
          <h3>🎉 New Badge Earned!</h3>
          <div className="badge-showcase">
            {evaluation.badge_earned}
          </div>
          <p>You now have {evaluation.total_badges} total badges!</p>
        </div>
      )}
      
      {/* Show progress to next badge */}
      <div className="badge-progress">
        <p>Total Score: <strong>{evaluation.total_score}</strong></p>
        {/* Add progress bar here if desired */}
      </div>
    </div>
    
    {/* ... rest of evaluation ... */}
  </div>
)}
```

### Add Badge Progress Component

```javascript
// New component: BadgeProgress.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BadgeProgress.css';

function BadgeProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadgeProgress();
  }, []);

  const fetchBadgeProgress = async () => {
    try {
      const response = await axios.get('/user/badge-progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch badge progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading badge progress...</div>;
  if (!progress) return null;

  return (
    <div className="badge-progress-container">
      <h2>🏅 Your Badge Journey</h2>
      
      {/* Current Progress */}
      <div className="current-progress">
        <div className="score-display">
          <h3>Total Score: {progress.current_score}</h3>
        </div>
        
        {progress.next_badge && (
          <div className="next-badge-card">
            <h4>Next Badge: {progress.next_badge.nextBadge}</h4>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.next_badge.percentage}%` }}
              />
            </div>
            <p>
              {progress.next_badge.remaining} points to go 
              ({progress.next_badge.current}/{progress.next_badge.required})
            </p>
          </div>
        )}
      </div>

      {/* All Earned Badges */}
      <div className="earned-badges-section">
        <h3>Earned Badges ({progress.total_badges})</h3>
        <div className="badges-grid">
          {progress.earned_badges.map((badge, index) => (
            <div key={index} className="badge-item earned">
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Special Achievements */}
      <div className="special-achievements">
        <h3>Special Achievements</h3>
        <div className="achievements-grid">
          {progress.special_achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.emoji}</div>
              <h4>{achievement.name}</h4>
              <div className="achievement-progress">
                <div className="progress-bar small">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min((achievement.current / achievement.required) * 100, 100)}%` 
                    }}
                  />
                </div>
                <span>{achievement.current}/{achievement.required}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Progress */}
      <div className="tier-progress">
        <h3>Tier Progression</h3>
        <div className="tier-grid">
          <div className="tier-card">
            <h4>Tier 1: Beginner</h4>
            <p>{progress.tier_progress.tier_1}/4 badges</p>
          </div>
          <div className="tier-card">
            <h4>Tier 2: Intermediate</h4>
            <p>{progress.tier_progress.tier_2}/4 badges</p>
          </div>
          <div className="tier-card">
            <h4>Tier 3: Advanced</h4>
            <p>{progress.tier_progress.tier_3}/4 badges</p>
          </div>
          <div className="tier-card">
            <h4>Tier 4: Elite</h4>
            <p>{progress.tier_progress.tier_4}/4 badges</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeProgress;
```

---

## 📊 Database Updates

The existing schema already supports this! The `badges` column in the `users` table stores all badges as a TEXT array.

---

## ✅ Testing the Badge System

### Test Case 1: New User
```bash
# First submission (50 points)
# Should earn: 🌱 First Steps

# Second submission (60 points) - Total: 110
# Should earn: 🌿 Seedling

# Check badges
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/user/profile
```

### Test Case 2: Score Milestone
```bash
# User with 490 points submits and scores 80
# New total: 570
# Should earn: 🌾 Eco Novice (crossed 500 threshold)
```

### Test Case 3: Special Achievement
```bash
# User completes 50th challenge
# Should automatically earn: 📚 Dedicated Learner
```

---

## 🎯 Key Features

✅ **Score-Based**: Badges depend only on total score
✅ **Permanent**: Once earned, badges stay forever
✅ **Progressive**: New badges unlock as score increases
✅ **Tier System**: 4 tiers with increasing difficulty
✅ **Special Achievements**: Extra badges for milestones
✅ **No AI Involvement**: Badges calculated by backend logic
✅ **Transparent**: Users can see progress to next badge

---

## 📝 Summary

The badge system now:
1. ✅ Awards badges based on **total accumulated score**
2. ✅ Keeps all earned badges **permanently**
3. ✅ Awards **new badges** as score grows
4. ✅ Has **clear progression tiers**
5. ✅ Includes **special achievement badges**
6. ✅ Shows **progress to next badge**
7. ✅ **OpenAI doesn't generate badges** - all logic is in backend

Your users will love this transparent, achievement-based progression system! 🎉
