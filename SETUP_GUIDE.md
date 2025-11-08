# 🌱 EcoPrompt Quest - Complete Setup Guide

## Overview
EcoPrompt Quest is a gamified learning portal that teaches users how to use Microsoft 365 Copilot effectively while promoting sustainable AI practices through prompt engineering education.

## Tech Stack
- **Frontend**: React.js 18+ with React Router
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL
- **AI Evaluation**: OpenAI GPT-4
- **Authentication**: JWT (JSON Web Tokens)

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js v18+ and npm v9+
- PostgreSQL 14+
- OpenAI API Key (GPT-4 access)
- Git

---

## 🚀 Quick Start Installation

### Step 1: Database Setup

```bash
# Create PostgreSQL database
createdb ecoprompt_quest

# Connect to PostgreSQL
psql -U postgres

# Set up the database schema
psql -U postgres -d ecoprompt_quest -f database-schema.sql
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=ecoprompt_quest
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT Secret (generate a strong random string)
JWT_SECRET=your_very_secure_random_jwt_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

```bash
# Start the backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start the React development server
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 📁 Project Structure

```
ecoprompt-quest/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── database-schema.sql       # PostgreSQL schema
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── App.css              # Global styles
│   │   ├── components/
│   │   │   ├── Auth.js          # Login, Register, Navigation
│   │   │   ├── Dashboard.js     # User dashboard
│   │   │   ├── ChallengeDetail.js
│   │   │   ├── LeaderboardAndChallenges.js
│   │   │   └── [other components]
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔧 Configuration Details

### Database Tables

1. **users** - User accounts with roles and scores
2. **challenges** - Learning challenges for each role
3. **submissions** - User prompt submissions and evaluations

### User Roles

- `developer` 💻 - Software developers
- `business_analyst` 📊 - Business analysts
- `project_manager` 📋 - Project managers
- `scrum_master` 🏃 - Scrum masters

### Challenge Difficulty Levels

- `easy` ⭐ - Beginner level (80-100 points)
- `medium` ⭐⭐ - Intermediate level (100-120 points)
- `hard` ⭐⭐⭐ - Advanced level (120-150 points)
- `expert` ⭐⭐⭐⭐ - Expert level (150-200 points)

---

## 🎮 How It Works

### User Flow

1. **Register/Login** → User selects their role
2. **Dashboard** → View personalized challenges and stats
3. **Select Challenge** → Choose from role-specific tasks
4. **Submit Work** → Enter prompt used and Copilot's output
5. **Get Evaluation** → Receive AI-powered feedback, score, and learning points
6. **Earn Rewards** → Accumulate eco-score, badges, and climb leaderboard

### Evaluation Process

When a user submits a challenge:

1. **Input Validation**: User provides their prompt and Copilot's result
2. **GPT-4 Evaluation**: OpenAI analyzes the submission against ideal standards
3. **Scoring**: Calculates eco-score (0-100) based on:
   - Prompt quality (60%)
   - Task difficulty (20%)
   - CO₂ efficiency (20%)
4. **Feedback Generation**: Provides:
   - Evaluation summary
   - Optimized prompt
   - Learning points
   - Improvement areas
5. **Rewards**: Updates user's score, rank, and awards badges

---

## 🌍 CO₂ Savings Calculation

The platform estimates CO₂ savings based on prompt efficiency:

| Score Range | CO₂ Saved | Reasoning |
|------------|-----------|-----------|
| 90-100 | 0.25-0.30g | Excellent prompt, minimal reprocessing needed |
| 70-89 | 0.15-0.24g | Good prompt, some optimization possible |
| 50-69 | 0.05-0.14g | Fair prompt, moderate improvements needed |
| <50 | 0.00-0.04g | Poor prompt, significant reprocessing required |

**Real-world Equivalents:**
- 1g CO₂ saved = ~50 Google searches avoided
- 1g CO₂ saved = ~10 minutes laptop sleep mode
- 1g CO₂ saved = ~20 minutes LED bulb usage

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: express-validator for request validation

---

## 🎨 Design System

### Color Palette
- Primary Green: `#8BC34A`
- Dark Green: `#689F38`
- Light Green: `#A5D6A7`
- Accent Blue: `#81D4FA`
- Earth Beige: `#D7CCC8`

### Typography
- Font Family: Inter, system fonts
- Headings: Bold, 1.5-2.5rem
- Body: Regular, 1rem
- Small text: 0.875rem

---

## 📊 Admin Features

Admins can:
- Create new challenges with ideal prompts
- Set difficulty levels and point values
- View platform statistics
- Monitor user engagement
- Track total CO₂ savings

### Creating a Challenge (Admin API)

```javascript
POST /api/admin/challenge/create

{
  "challenge_id": "dev_004",
  "title": "Challenge Title",
  "description": "Detailed description",
  "role": "developer",
  "ideal_prompt": "You are a senior developer...",
  "expected_result": "Expected output format...",
  "difficulty_level": "medium",
  "eco_points_max": 100
}
```

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create ecoprompt-quest-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main

# Run database migrations
heroku run psql $DATABASE_URL -f database-schema.sql
```

### Frontend Deployment (Example: Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-api-url.herokuapp.com/api
```

---

## 📈 Monitoring & Analytics

### Key Metrics to Track

- **User Engagement**: Daily active users, submissions per user
- **Learning Progress**: Average scores by role, challenge completion rates
- **Environmental Impact**: Total CO₂ saved across platform
- **Challenge Difficulty**: Success rates by difficulty level

### Database Queries for Analytics

```sql
-- Top performers
SELECT username, eco_score, total_co2_saved 
FROM users 
ORDER BY eco_score DESC 
LIMIT 10;

-- Challenge completion stats
SELECT c.title, COUNT(s.id) as submissions, AVG(s.eco_score) as avg_score
FROM challenges c
LEFT JOIN submissions s ON c.challenge_id = s.challenge_id
GROUP BY c.title;

-- Total platform impact
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  SUM(total_co2_saved) as total_co2,
  AVG(eco_score) as avg_score
FROM users;
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot connect to database"
- **Solution**: Check PostgreSQL is running and credentials in `.env` are correct

**Issue**: "OpenAI API key invalid"
- **Solution**: Verify your API key has GPT-4 access

**Issue**: "CORS error in frontend"
- **Solution**: Ensure `ALLOWED_ORIGINS` in backend `.env` includes frontend URL

**Issue**: "JWT token expired"
- **Solution**: Token expiry is set to 24h, re-login to get new token

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "username": "john_dev",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "developer"
}
```

#### POST `/api/auth/login`
Login and receive JWT token
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Challenge Endpoints

#### GET `/api/challenges/:role`
Get all challenges for a specific role

#### GET `/api/challenge/:challengeId`
Get details of a specific challenge

#### POST `/api/challenge/submit`
Submit a challenge solution (requires authentication)
```json
{
  "challenge_id": "dev_001",
  "user_prompt": "Your prompt here...",
  "copilot_result": "Copilot's output here..."
}
```

### Leaderboard & Profile

#### GET `/api/leaderboard`
Get global leaderboard (requires authentication)

#### GET `/api/user/profile`
Get current user's profile (requires authentication)

#### GET `/api/user/submissions`
Get user's submission history (requires authentication)

---

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@ecopromptquest.com
- Documentation: https://docs.ecopromptquest.com

---

## 📄 License

MIT License - feel free to use this project for educational purposes

---

## 🙏 Acknowledgments

- Microsoft 365 Copilot for inspiration
- OpenAI GPT-4 for evaluation capabilities
- The open-source community

---

**Happy Prompting! 🌱 Let's make AI sustainable together!**
