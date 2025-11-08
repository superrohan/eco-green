// ============================================
// ECOPROMPT QUEST - BACKEND API STRUCTURE
// Express.js + PostgreSQL + OpenAI GPT-4
// ============================================

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ============================================
// DATABASE CONFIGURATION
// ============================================
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'ecoprompt_quest',
  password: 'your_password',
  port: 5432,
});

// ============================================
// OPENAI CONFIGURATION
// ============================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ============================================
// MIDDLEWARE: JWT Authentication
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ============================================
// MIDDLEWARE: Admin Check
// ============================================
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============================================
// ROUTE 1: USER REGISTRATION
// ============================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate role
    const validRoles = ['developer', 'business_analyst', 'project_manager', 'scrum_master'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, eco_score, rank, created_at) 
       VALUES ($1, $2, $3, $4, 0, 0, NOW()) RETURNING id, username, email, role`,
      [username, email, hashedPassword, role]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// ============================================
// ROUTE 2: USER LOGIN
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        eco_score: user.eco_score,
        rank: user.rank,
        total_co2_saved: user.total_co2_saved
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================
// ROUTE 3: GET USER PROFILE
// ============================================
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, role, eco_score, rank, total_co2_saved, 
              badges, created_at FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ============================================
// ROUTE 4: GET ROLE-BASED CHALLENGES
// ============================================
app.get('/api/challenges/:role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.params;
    const result = await pool.query(
      `SELECT challenge_id, title, description, difficulty_level, eco_points_max, 
              created_at FROM challenges WHERE role = $1 AND is_active = true 
       ORDER BY created_at DESC`,
      [role]
    );

    res.json({
      role,
      challenges: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// ============================================
// ROUTE 5: GET SINGLE CHALLENGE DETAILS
// ============================================
app.get('/api/challenge/:challengeId', authenticateToken, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const result = await pool.query(
      `SELECT challenge_id, title, description, role, difficulty_level, 
              eco_points_max FROM challenges WHERE challenge_id = $1`,
      [challengeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// ============================================
// ROUTE 6: SUBMIT CHALLENGE (CORE EVALUATION)
// ============================================
app.post('/api/challenge/submit', authenticateToken, async (req, res) => {
  try {
    const { challenge_id, user_prompt, copilot_result } = req.body;
    const userId = req.user.id;

    // Fetch challenge details (including ideal prompt and expected result)
    const challengeResult = await pool.query(
      `SELECT * FROM challenges WHERE challenge_id = $1`,
      [challenge_id]
    );

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challengeResult.rows[0];

    // Call OpenAI GPT-4 for evaluation
    const evaluationPrompt = `
You are the core intelligence engine powering "EcoPrompt Quest", a gamified learning portal teaching Microsoft 365 Copilot usage and prompt engineering.

**Challenge Context:**
- Title: ${challenge.title}
- Description: ${challenge.description}
- Role: ${challenge.role}
- Ideal Prompt: ${challenge.ideal_prompt}
- Expected Result: ${challenge.expected_result}

**User Submission:**
- User Prompt: "${user_prompt}"
- Copilot Result: "${copilot_result}"

**Your Task:**
Evaluate the user's prompt and Copilot result against the ideal standards. Provide a structured JSON response with:

1. **evaluation_summary**: A concise 2-3 sentence evaluation of what the user did well and what needs improvement.
2. **optimized_prompt**: The corrected/improved version of the user's prompt using proper prompt engineering techniques.
3. **learning_point**: A 1-2 paragraph educational explanation of which prompting techniques apply and why (e.g., role prompting, specificity, constraint framing, chain-of-thought).
4. **eco_score**: A numerical score from 0-100 based on:
   - Prompt quality (60%)
   - Task difficulty (20%)
   - CO₂ efficiency (20%)
5. **co2_saved**: Estimated CO₂ saved in grams (e.g., "0.22g"). Use this scale:
   - Excellent (90-100): 0.25-0.30g
   - Good (70-89): 0.15-0.24g
   - Fair (50-69): 0.05-0.14g
   - Poor (<50): 0.00-0.04g
6. **badge_earned**: Award a badge if applicable (e.g., "Green Coder 🌿", "Sustainable Analyst 🌎", "Eco Warrior 🌱"). Return null if no badge earned.
7. **improvement_areas**: Array of specific areas to improve (e.g., ["Add role context", "Specify output format", "Include examples"])

Respond ONLY with valid JSON, no markdown formatting.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert prompt engineering evaluator for a gamified learning platform. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: evaluationPrompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const evaluation = JSON.parse(completion.choices[0].message.content);

    // Save submission to database
    const submissionResult = await pool.query(
      `INSERT INTO submissions 
       (user_id, challenge_id, user_prompt, copilot_result, eco_score, co2_saved, 
        evaluation_summary, optimized_prompt, learning_point, badge_earned, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING id`,
      [
        userId,
        challenge_id,
        user_prompt,
        copilot_result,
        evaluation.eco_score,
        evaluation.co2_saved,
        evaluation.evaluation_summary,
        evaluation.optimized_prompt,
        evaluation.learning_point,
        evaluation.badge_earned
      ]
    );

    // Update user's eco_score and total_co2_saved
    await pool.query(
      `UPDATE users 
       SET eco_score = eco_score + $1, 
           total_co2_saved = total_co2_saved + $2,
           badges = CASE 
             WHEN $3 IS NOT NULL AND NOT ($3 = ANY(badges)) 
             THEN array_append(badges, $3) 
             ELSE badges 
           END
       WHERE id = $4`,
      [evaluation.eco_score, parseFloat(evaluation.co2_saved.replace('g', '')), evaluation.badge_earned, userId]
    );

    // Calculate rank change
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

    // Update rank
    await pool.query('UPDATE users SET rank = $1 WHERE id = $2', [newRank, userId]);

    res.json({
      submission_id: submissionResult.rows[0].id,
      ...evaluation,
      leaderboard_update: {
        rank_change: rankChange > 0 ? `+${rankChange}` : rankChange.toString(),
        new_rank: newRank
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Evaluation failed', details: error.message });
  }
});

// ============================================
// ROUTE 7: GET LEADERBOARD
// ============================================
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         ROW_NUMBER() OVER (ORDER BY eco_score DESC) as rank,
         id, username, role, eco_score, total_co2_saved, badges
       FROM users
       ORDER BY eco_score DESC
       LIMIT 100`
    );

    res.json({
      leaderboard: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ============================================
// ROUTE 8: GET USER SUBMISSION HISTORY
// ============================================
app.get('/api/user/submissions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         s.id, s.challenge_id, c.title as challenge_title, s.user_prompt, 
         s.eco_score, s.co2_saved, s.badge_earned, s.submitted_at
       FROM submissions s
       JOIN challenges c ON s.challenge_id = c.challenge_id
       WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json({
      submissions: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// ============================================
// ROUTE 9: ADMIN - CREATE CHALLENGE
// ============================================
app.post('/api/admin/challenge/create', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      challenge_id,
      title,
      description,
      role,
      ideal_prompt,
      expected_result,
      difficulty_level,
      eco_points_max
    } = req.body;

    const result = await pool.query(
      `INSERT INTO challenges 
       (challenge_id, title, description, role, ideal_prompt, expected_result, 
        difficulty_level, eco_points_max, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
       RETURNING *`,
      [challenge_id, title, description, role, ideal_prompt, expected_result, 
       difficulty_level, eco_points_max]
    );

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// ============================================
// ROUTE 10: ADMIN - GET ALL CHALLENGES
// ============================================
app.get('/api/admin/challenges', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM challenges ORDER BY created_at DESC`
    );

    res.json({
      challenges: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// ============================================
// ROUTE 11: ADMIN - DASHBOARD STATS
// ============================================
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const submissionCount = await pool.query('SELECT COUNT(*) as count FROM submissions');
    const totalCO2 = await pool.query('SELECT SUM(total_co2_saved) as total FROM users');
    const avgScore = await pool.query('SELECT AVG(eco_score) as average FROM users');

    res.json({
      total_users: parseInt(userCount.rows[0].count),
      total_submissions: parseInt(submissionCount.rows[0].count),
      total_co2_saved: parseFloat(totalCO2.rows[0].total || 0).toFixed(2) + 'g',
      average_eco_score: parseFloat(avgScore.rows[0].average || 0).toFixed(2)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌿 EcoPrompt Quest Backend running on port ${PORT}`);
});

module.exports = app;
