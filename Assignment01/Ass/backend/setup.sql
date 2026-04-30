-- Create Database (if not exists - run this manually if needed, script assumes DB exists)
-- CREATE DATABASE university_db;

-- Connect to the database before running the following

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS students03;
DROP TABLE IF EXISTS users03;
DROP TABLE IF EXISTS departments03;

-- Create Departments Table
CREATE TABLE departments03 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100)
);

-- Create Students Table
CREATE TABLE students03 (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INTEGER REFERENCES departments03(id) ON DELETE SET NULL,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table (for Authentication)
CREATE TABLE users03 (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- In production, use hashed passwords!
    role VARCHAR(20) DEFAULT 'user'
);

-- Insert Dummy Data for Departments
INSERT INTO departments03 (name, location) VALUES 
('Computer Science', 'Building A'),
('Electrical Engineering', 'Building B'),
('Mechanical Engineering', 'Building C');

-- Insert Dummy Data for Students
INSERT INTO students03 (first_name, last_name, email, department_id, dob) VALUES 
('John', 'Doe', 'john.doe@example.com', 1, '2000-05-15'),
('Jane', 'Smith', 'jane.smith@example.com', 2, '2001-08-20'),
('Alice', 'Johnson', 'alice.j@example.com', 1, '1999-12-10');

-- Insert Dummy User (admin/admin)
INSERT INTO users03 (username, password, role) VALUES 
('admin', 'admin', 'admin'),
('user', 'user', 'user');
