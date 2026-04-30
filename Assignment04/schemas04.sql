-- Table: users04
CREATE TABLE users04 (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams04 (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    subject VARCHAR(50),
    duration_minutes INTEGER DEFAULT 60,
    created_by INTEGER REFERENCES users04(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_assignments04 (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams04(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users04(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id)
);

-- Table: questions04
CREATE TABLE questions04 (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams04(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    image_url TEXT,
    options JSONB NOT NULL,
    correct_option VARCHAR(1) NOT NULL, -- e.g. 'a', 'b', 'c', 'd'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results04 (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users04(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams04(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users04 (username, password, role) VALUES 
('mayur', 'mayur123', 'teacher'),
('rohan', 'rohan123', 'student');

INSERT INTO exams04 (title, description, subject, duration_minutes, created_by) VALUES
('General Knowledge 101', 'Basic GK Questions', 'GK', 30, 1),
('Mathematics Basics', 'Algebra and Geometry', 'Math', 45, 1);

INSERT INTO questions04 (exam_id, question_text, options, correct_option) VALUES
(1, 'What is the capital of France?', '[{"id": "a", "text": "Berlin"}, {"id": "b", "text": "Madrid"}, {"id": "c", "text": "Paris"}, {"id": "d", "text": "Rome"}]', 'c'),
(1, 'Which planet is known as the Red Planet?', '[{"id": "a", "text": "Earth"}, {"id": "b", "text": "Mars"}, {"id": "c", "text": "Jupiter"}, {"id": "d", "text": "Venus"}]', 'b');

-- Grant Permissions for User 23510014

GRANT CONNECT ON DATABASE "DB23510014" TO "23510014";

GRANT USAGE ON SCHEMA public TO "23510014";

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "23510014";

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO "23510014";

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "23510014";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO "23510014";
