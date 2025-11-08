-- ============================================
-- ECOPROMPT QUEST - DATABASE SCHEMA
-- PostgreSQL Database Setup
-- ============================================

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLE 1: USERS
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('developer', 'business_analyst', 'project_manager', 'scrum_master')),
    is_admin BOOLEAN DEFAULT false,
    eco_score INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    total_co2_saved DECIMAL(10, 2) DEFAULT 0.00,
    badges TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_eco_score ON users(eco_score DESC);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABLE 2: CHALLENGES
-- ============================================
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    challenge_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('developer', 'business_analyst', 'project_manager', 'scrum_master')),
    ideal_prompt TEXT NOT NULL,
    expected_result TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
    eco_points_max INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_challenges_role ON challenges(role);
CREATE INDEX idx_challenges_active ON challenges(is_active);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty_level);

-- ============================================
-- TABLE 3: SUBMISSIONS
-- ============================================
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(100) NOT NULL REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    user_prompt TEXT NOT NULL,
    copilot_result TEXT NOT NULL,
    eco_score INTEGER NOT NULL,
    co2_saved VARCHAR(50),
    evaluation_summary TEXT,
    optimized_prompt TEXT,
    learning_point TEXT,
    badge_earned VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_date ON submissions(submitted_at DESC);
CREATE INDEX idx_submissions_score ON submissions(eco_score DESC);

-- ============================================
-- SAMPLE DATA: ADMIN USER
-- ============================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (username, email, password_hash, role, is_admin, eco_score, rank)
VALUES ('admin', 'admin@ecoprompt.com', '$2b$10$rZ5YbzXQZv3J8K7zJ8K7zO8K7zJ8K7zJ8K7zJ8K7zJ8K7zJ8K7zJe', 'developer', true, 0, 0);

-- ============================================
-- SAMPLE DATA: CHALLENGES FOR DEVELOPERS
-- ============================================
INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('dev_001', 'Generate REST API Documentation', 
'Use M365 Copilot in Word to generate comprehensive API documentation for a Java Spring Boot service.',
'developer',
'You are a senior Java developer. Write detailed API documentation for the following REST endpoints with example requests, responses, status codes, and error handling: GET /api/users, POST /api/users, PUT /api/users/{id}, DELETE /api/users/{id}. Include authentication requirements and rate limiting details.',
'A well-structured document with: endpoint descriptions, HTTP methods, request/response schemas, status codes (200, 201, 400, 401, 404, 500), authentication headers, rate limits, and JSON examples for each endpoint.',
'medium',
100);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('dev_002', 'Refactor Legacy Code',
'Use Copilot to refactor a piece of legacy JavaScript code to modern ES6+ standards with better performance.',
'developer',
'You are an expert JavaScript developer. Refactor the following legacy code to use modern ES6+ features including arrow functions, destructuring, async/await, and const/let. Also optimize for performance and add JSDoc comments: [paste legacy code]. Explain each change made.',
'Modernized code using ES6+ syntax, performance optimizations explained, comprehensive JSDoc comments, and a summary of improvements with before/after comparison.',
'hard',
150);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('dev_003', 'Debug Complex Error',
'Use Copilot to identify and fix bugs in a React component with state management issues.',
'developer',
'You are a React expert. Analyze this component for bugs related to state management, side effects, and re-rendering issues: [paste component code]. Identify all issues, explain why they occur, provide the corrected code, and suggest best practices to prevent similar bugs.',
'Detailed bug analysis with root cause explanations, corrected component code, performance optimizations, and React best practices checklist.',
'expert',
200);

-- ============================================
-- SAMPLE DATA: CHALLENGES FOR BUSINESS ANALYSTS
-- ============================================
INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('ba_001', 'Create User Story from Requirements',
'Transform business requirements into well-structured user stories with acceptance criteria.',
'business_analyst',
'You are an experienced business analyst. Convert the following business requirement into a user story using the format: As a [user type], I want [goal] so that [benefit]. Include clear acceptance criteria in Given-When-Then format and definition of done: [paste requirement]. Add story points estimation.',
'Properly formatted user story with role-goal-benefit structure, 3-5 acceptance criteria in Given-When-Then format, definition of done checklist, and story points with justification.',
'easy',
80);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('ba_002', 'Summarize Stakeholder Meeting',
'Create an executive summary of a stakeholder meeting with action items and decisions.',
'business_analyst',
'You are a business analyst preparing an executive summary for senior leadership. Summarize the following stakeholder meeting transcript. Structure it with: Key Decisions Made, Action Items (with owners and due dates), Risks Identified, Next Steps, and Open Questions. Keep it concise and business-focused: [paste transcript].',
'Executive summary with clear sections, action items table with owners and dates, prioritized risks, concrete next steps, and unresolved questions requiring leadership input.',
'medium',
100);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('ba_003', 'Build Financial Model in Excel',
'Use Copilot to create Excel formulas for a complex financial forecasting model.',
'business_analyst',
'You are a financial analyst. Create Excel formulas for a 3-year revenue forecasting model with: monthly recurring revenue (MRR), customer acquisition cost (CAC), customer lifetime value (LTV), churn rate, and growth projections. Include data validation rules and conditional formatting. Provide formulas for cells B2:B36 assuming headers in row 1.',
'Complete set of Excel formulas with cell references, data validation rules (dropdown lists, number ranges), conditional formatting rules (color scales for performance), and formula explanations.',
'hard',
150);

-- ============================================
-- SAMPLE DATA: CHALLENGES FOR PROJECT MANAGERS
-- ============================================
INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('pm_001', 'Create Project Charter',
'Generate a comprehensive project charter for a new software development initiative.',
'project_manager',
'You are a certified PMP project manager. Create a project charter for a new mobile app development project with: project objectives, scope statement, key stakeholders, high-level requirements, success criteria, constraints, assumptions, and initial risk assessment. Format it professionally.',
'Professional project charter document with all PMI-standard sections, clearly defined SMART objectives, stakeholder matrix with roles, measurable success criteria, documented constraints and assumptions, and top 5 initial risks.',
'medium',
100);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('pm_002', 'Build Project Timeline',
'Create a detailed project timeline with milestones, dependencies, and critical path.',
'project_manager',
'You are a project manager creating a Gantt chart timeline. For a 6-month software development project, create a detailed timeline with: phases (Initiation, Planning, Execution, Testing, Deployment), key milestones, task dependencies, resource allocation, and identify the critical path. Provide in table format with dates, duration, and dependencies.',
'Comprehensive project timeline table with start/end dates, duration in days, predecessors, resources assigned, milestone markers, and critical path tasks highlighted with explanation.',
'hard',
150);

-- ============================================
-- SAMPLE DATA: CHALLENGES FOR SCRUM MASTERS
-- ============================================
INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('sm_001', 'Facilitate Sprint Retrospective',
'Create a structured sprint retrospective summary with actionable improvements.',
'scrum_master',
'You are an experienced Scrum Master. Based on the following team feedback from a sprint retrospective, create a summary document with: What Went Well, What Needs Improvement, Action Items (with owners), Team Mood Assessment, and Commitment for Next Sprint. Use the Start-Stop-Continue framework: [paste team feedback].',
'Well-structured retrospective summary with positive highlights, improvement areas categorized by Start-Stop-Continue, specific action items with owners and timelines, team sentiment analysis, and clear commitments.',
'easy',
80);

INSERT INTO challenges (challenge_id, title, description, role, ideal_prompt, expected_result, difficulty_level, eco_points_max) VALUES
('sm_002', 'Draft Daily Standup Report',
'Summarize daily standup updates into a concise team status report for stakeholders.',
'scrum_master',
'You are a Scrum Master reporting to stakeholders. Summarize the following daily standup updates into a concise status report with: Progress Summary, Blockers Requiring Escalation, Sprint Burndown Status, At-Risk Items, and Overall Health Indicator (Green/Yellow/Red). Keep it brief and action-oriented: [paste standup notes].',
'Concise stakeholder report with progress percentage, critical blockers highlighted, burndown analysis (on track/behind), at-risk items with mitigation plans, and RAG status with justification.',
'medium',
100);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update challenge updated_at timestamp
CREATE OR REPLACE FUNCTION update_challenge_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for challenges table
CREATE TRIGGER trigger_update_challenge_timestamp
BEFORE UPDATE ON challenges
FOR EACH ROW
EXECUTE FUNCTION update_challenge_timestamp();

-- Function to automatically update user rank
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS void AS $$
BEGIN
    UPDATE users
    SET rank = ranked.new_rank
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY eco_score DESC) as new_rank
        FROM users
    ) ranked
    WHERE users.id = ranked.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View: Top performers by role
CREATE OR REPLACE VIEW top_performers_by_role AS
SELECT 
    role,
    username,
    eco_score,
    total_co2_saved,
    ARRAY_LENGTH(badges, 1) as badge_count,
    ROW_NUMBER() OVER (PARTITION BY role ORDER BY eco_score DESC) as role_rank
FROM users
WHERE eco_score > 0
ORDER BY role, eco_score DESC;

-- View: Challenge completion statistics
CREATE OR REPLACE VIEW challenge_stats AS
SELECT 
    c.challenge_id,
    c.title,
    c.role,
    c.difficulty_level,
    COUNT(s.id) as submission_count,
    AVG(s.eco_score) as avg_score,
    MAX(s.eco_score) as max_score,
    MIN(s.eco_score) as min_score
FROM challenges c
LEFT JOIN submissions s ON c.challenge_id = s.challenge_id
GROUP BY c.challenge_id, c.title, c.role, c.difficulty_level;

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'Database schema created successfully! 🌿' as message;
