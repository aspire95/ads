-- Database Setup for Assignment 03 (Run in pgAdmin4 Query Tool)

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS students03;
DROP TABLE IF EXISTS users03;
DROP TABLE IF EXISTS departments03;

-- 1. Create Departments Table (departments03)
CREATE TABLE departments03 (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create Users Table (users03)
CREATE TABLE users03 (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student', 'faculty'))
);

-- 3. Create Students Table (students03)
CREATE TABLE students03 (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    dept_id INTEGER REFERENCES departments03(dept_id) ON DELETE SET NULL
);

-- 4. Insert Data into departments03
INSERT INTO departments03 (dept_name) VALUES 
('Computer Science'),
('Information Technology'),
('Electronics');

-- 5. Insert Data into users03 (as per request: mayur, sagar, alok, rupesh)
-- Assuming 'mayur' is admin, others are students based on typical assignment patterns or context
INSERT INTO users03 (username, password, role) VALUES 
('mayur', 'mayur123', 'admin'),
('sagar', 'sagar123', 'student'),
('alok', 'alok123', 'student'),
('rupesh', 'rupesh123', 'student');

-- 6. Insert Data into students03 (matching users if intended, or independent students)
-- Adding sample students with corresponding names
INSERT INTO students03 (name, email, dept_id) VALUES 
('Mayur Admin', 'mayur@example.com', 1),
('Sagar Student', 'sagar@example.com', 2),
('Alok Student', 'alok@example.com', 2),
('Rupesh Student', 'rupesh@example.com', 3);

-- Verification Selects
SELECT * FROM users03;
SELECT * FROM students03;
SELECT * FROM departments03;

-- Grant Permissions to User '23510014' (Assuming schema 'public')
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO "23510014";

-- Grant all privileges on tables
GRANT ALL PRIVILEGES ON TABLE students03 TO "23510014";
GRANT ALL PRIVILEGES ON TABLE departments03 TO "23510014";
GRANT ALL PRIVILEGES ON TABLE users03 TO "23510014";

-- Grant usage/update on sequences (for SERIAL columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "23510014";

