-- ==========================================================
-- UNIVERSITY ERP DATABASE - FINAL WORKING SCRIPT
-- Database: DB03 | User: 23510014
-- Objective: Fix hashing mismatch, ensure all roles work, and populate with 10 users each
-- ==========================================================

-- 1. Reset Environment
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS hostel CASCADE;
DROP TABLE IF EXISTS fees CASCADE;
DROP TABLE IF EXISTS syllabus CASCADE;
DROP TABLE IF EXISTS takes CASCADE;
DROP TABLE IF EXISTS teaches CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS classroom CASCADE;

-- 2. Infrastructure & Academics
CREATE TABLE classroom (
    building VARCHAR(50), 
    room_number VARCHAR(10), 
    PRIMARY KEY (building, room_number)
);

CREATE TABLE department (
    dept_name VARCHAR(50) PRIMARY KEY, 
    building VARCHAR(50), 
    budget NUMERIC(12,2)
);

CREATE TABLE instructor (
    ID VARCHAR(10) PRIMARY KEY, 
    name VARCHAR(50) NOT NULL, 
    dept_name VARCHAR(50) REFERENCES department(dept_name), 
    email VARCHAR(100),
    salary NUMERIC(10,2)
);

CREATE TABLE student (
    ID VARCHAR(10) PRIMARY KEY, 
    name VARCHAR(50) NOT NULL, 
    dept_name VARCHAR(50) REFERENCES department(dept_name), 
    tot_cred NUMERIC(3,0) DEFAULT 0, 
    email VARCHAR(100)
);

CREATE TABLE course (
    course_id VARCHAR(10) PRIMARY KEY, 
    title VARCHAR(100), 
    dept_name VARCHAR(50) REFERENCES department(dept_name), 
    credits NUMERIC(2,0)
);

CREATE TABLE section (
    course_id VARCHAR(10) REFERENCES course(course_id),
    sec_id VARCHAR(8),
    semester VARCHAR(10),
    year INT,
    building VARCHAR(50),
    room_number VARCHAR(10),
    PRIMARY KEY (course_id, sec_id, semester, year),
    FOREIGN KEY (building, room_number) REFERENCES classroom(building, room_number)
);

-- 3. Security (RBAC)
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY, 
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    ref_id VARCHAR(10)
);

CREATE TABLE registrations (
    reg_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_name VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    dept_name VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ERP & Collaboration
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY, 
    title VARCHAR(100), 
    description TEXT, 
    course_id VARCHAR(10) REFERENCES course(course_id), 
    instructor_id VARCHAR(10) REFERENCES instructor(ID), 
    due_date DATE
);

CREATE TABLE task_submissions (
    submission_id SERIAL PRIMARY KEY, 
    task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE, 
    student_id VARCHAR(10) REFERENCES student(ID), 
    content TEXT, 
    grade VARCHAR(5), 
    feedback TEXT,
    UNIQUE(task_id, student_id)
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY, 
    student_id VARCHAR(10) REFERENCES student(ID), 
    course_id VARCHAR(10) REFERENCES course(course_id), 
    date DATE, 
    status VARCHAR(10)
);

CREATE TABLE fees (
    fee_id SERIAL PRIMARY KEY, 
    student_id VARCHAR(10) REFERENCES student(ID), 
    amount NUMERIC(10,2), 
    status VARCHAR(10)
);

CREATE TABLE takes (
    ID VARCHAR(10) REFERENCES student(ID), 
    course_id VARCHAR(10) REFERENCES course(course_id), 
    sec_id VARCHAR(8),
    semester VARCHAR(10),
    year INT,
    grade VARCHAR(2),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year)
);

-- 5. DATA SEEDING

-- Roles
INSERT INTO roles (role_name) VALUES ('Admin'), ('Faculty'), ('Student');

-- Departments
INSERT INTO department VALUES 
('Computer Science', 'Main', 1500000), ('IT', 'Tech Tower', 1200000), ('Electronics', 'E-Wing', 800000),
('Mechanical', 'M-Block', 1000000), ('Civil', 'C-Block', 950000), ('Electrical', 'E-Park', 850000),
('Physics', 'Sci-Lab', 500000), ('Mathematics', 'Sci-Lab', 400000), ('Arts', 'Heritage', 300000), ('Management', 'B-School', 2000000);

-- Classrooms
INSERT INTO classroom VALUES ('Main', '101'), ('Main', '102'), ('Tech Tower', '201'), ('E-Wing', '301');

-- Courses & Sections
INSERT INTO course VALUES 
('CS101', 'Database Systems', 'Computer Science', 4), ('IT201', 'Web Apps', 'IT', 3);
INSERT INTO section VALUES 
('CS101', '1', 'Spring', 2026, 'Main', '101'), ('IT201', '1', 'Spring', 2026, 'Tech Tower', '201');


-- Instructors
INSERT INTO instructor VALUES
('I001', 'Rahul Sharma', 'Computer Science', 'rahul@mis.edu', 80000),
('I002', 'Priya Patil', 'IT', 'priya@mis.edu', 81000),
('I003', 'Amit Verma', 'Electronics', 'amit@mis.edu', 82000),
('I004', 'Sneha Gupta', 'Computer Science', 'sneha@mis.edu', 83000),
('I005', 'Vikram Singh', 'Mechanical', 'vikram@mis.edu', 84000),
('I006', 'Neha Raj', 'Civil', 'neha@mis.edu', 85000),
('I007', 'Rohit Kadam', 'Electrical', 'rohit@mis.edu', 86000),
('I008', 'Kavita Joshi', 'Physics', 'kavita@mis.edu', 87000),
('I009', 'Saurabh Nair', 'Mathematics', 'saurabh@mis.edu', 88000),
('I010', 'Anita Rao', 'Arts', 'anita@mis.edu', 89000);

-- Students
INSERT INTO student (ID, name, dept_name, tot_cred, email) VALUES
('S001', 'Sagar Patil', 'Computer Science', 20, 'sagar@mis.edu'),
('S002', 'Suyog Kulkarni', 'IT', 20, 'suyog@mis.edu'),
('S003', 'Mayur Deshmukh', 'Electronics', 20, 'mayur@mis.edu'),
('S004', 'Nikhil Mane', 'Mechanical', 20, 'nikhil@mis.edu'),
('S005', 'Pooja Shinde', 'Computer Science', 20, 'pooja@mis.edu'),
('S006', 'Aditi Sharma', 'Civil', 20, 'aditi@mis.edu'),
('S007', 'Karan Desai', 'Electrical', 20, 'karan@mis.edu'),
('S008', 'Riya Singh', 'Physics', 20, 'riya@mis.edu'),
('S009', 'Prateek Kumar', 'Mathematics', 20, 'prateek@mis.edu'),
('S010', 'Divya Verma', 'Arts', 20, 'divya@mis.edu');

-- Users (Hashes for password '<username>123')
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('admin', '$2a$10$EzkrUOPL9qd28y8o0Ecu9epyuRJdPzRcmP/ROHczMEuJoQKeOxuS.', 1, NULL);
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('manager', '$2a$10$SwPhCfqTMPTyukCaASKZ4.N5fsy5RlHAnbSADKWRjqDYdmFmHsG0G', 1, NULL);
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('rahul', '$2a$10$KO/poo5lhWXf/28.LjvEUOUtUyjkrFsxYAnjzIZ//HNzrOhC7H7Qm', 2, 'I001');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('priya', '$2a$10$bk5eAE17iOPFZA5QMEGpeOVY7QJv8Stcv/Y/sjO9MfYQkv.yHo1Vu', 2, 'I002');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('amit', '$2a$10$RWJqM5d0jtxcD6.KrmC5DOp7jDq6YmzWkiqpk49bWrCU0.duWRN0W', 2, 'I003');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('sneha', '$2a$10$KmtdnkQF5s9DBofCPOkkNuHF4zXdnN0oOWvUUgCfJ.pmHRjkHEsyO', 2, 'I004');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('vikram', '$2a$10$D9G7z3leCaLl1GxG7d9DZOxYBT5RN6OEdJxyfe4SJoLhPGXe7oCPy', 2, 'I005');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('neha', '$2a$10$uRxEnTN6JoUw/oN/9lLLnuVAuc3IdEJrxam/M3TaaKShABCp4o2J2', 2, 'I006');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('rohit', '$2a$10$jmd.Uhjv9QBsesdTRugU4ubFnD0JK3j8NHvLs1OBYgyTKd1c/4ES.', 2, 'I007');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('kavita', '$2a$10$2MQCbApB3K1/x15RoMpxsOe6Df8F6ig6KsWxr5CUbxL.X9m8ogKPa', 2, 'I008');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('saurabh', '$2a$10$BW2RH8xotqRUOYXJU1aBd.tPL525yKwtylap.T/t7ALZfF1sL8Eae', 2, 'I009');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('anita', '$2a$10$r20bqVo4AW0hl0ghOLz4M.UK06UkeL9lKrUvtdrbe4yNqtuvq2yF.', 2, 'I010');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('sagar', '$2a$10$HV0C5EDyPe1NL3vGVSAKge0qaHziU5bs7Yam1Js/G213g7W8IBfe.', 3, 'S001');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('suyog', '$2a$10$3k6aYZTGliv3q9fSygKcJufmGApMeDzyDXuFp8sIwivh9C5WBgmma', 3, 'S002');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('mayur', '$2a$10$13Mk0g2CsQxSRl3KVcTaH.J.GNITy29kbS0XflrMkzBcN4q8xTi0O', 3, 'S003');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('nikhil', '$2a$10$ey6et4ShOoLBKN.vW8m08uEHu9AhxYMmsGNBW5LWQAUOt2a0Nkln.', 3, 'S004');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('pooja', '$2a$10$TbLx1TxtdvaGfLXhlsF7X.C6SOt4WRh.luJdjBOjVIV8Q8RWlX5xW', 3, 'S005');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('aditi', '$2a$10$cL5SjTR0RRPyxPmAJ.eLD.Y7EIGgm8mrf1jdcWQRA1GOruk1QFBWO', 3, 'S006');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('karan', '$2a$10$UPZfyNfxgURHQU7MogQ9memBVYVRLVQfv3NKJt2HsNxJi4EsV5uQ2', 3, 'S007');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('riya', '$2a$10$xj.9MkUXvsJY.HyJuXMwyOXVZM9X5W1BddZ1ZS0tp0d5Dg1RK7liO', 3, 'S008');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('prateek', '$2a$10$SS9VYoAQESUygAD4VfK6uuQxIAXkonu35v.KGbsGa43v7DmVQLAiy', 3, 'S009');
INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ('divya', '$2a$10$ygYEz9wOxLvUgZZG99Q39.nu.x/lkm9LJGsRFjeQo2saxtgjtdiwm', 3, 'S010');

GRANT USAGE, CREATE ON SCHEMA public TO "23510014";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "23510014";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "23510014";
