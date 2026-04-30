-- RUN THIS IN YOUR PGADMIN 4 QUERY TOOL

-- 1. Create Departments Table
CREATE TABLE departments03 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100)
);

-- 2. Create Students Table
CREATE TABLE students03 (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INTEGER REFERENCES departments03(id) ON DELETE SET NULL,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Users Table
CREATE TABLE users03 (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

-- 4. Insert Dummy Data
INSERT INTO departments03 (name, location) VALUES 
('Computer Science', 'Building A'),
('Electrical Engineering', 'Building B'),
('Mechanical Engineering', 'Building C');

INSERT INTO users03 (username, password, role) VALUES 
('admin', 'admin', 'admin'),
('user', 'user', 'user');

INSERT INTO students03 (first_name, last_name, email, department_id, dob) VALUES 
('John', 'Doe', 'john.doe@example.com', 1, '2000-05-15');
