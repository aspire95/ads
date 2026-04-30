CREATE TABLE test_table (
    RecordNumber NUMERIC(3),
    CurrentDate DATE
);

CREATE TABLE products (
    ProductID NUMERIC(4) PRIMARY KEY,
    category CHAR(3),
    detail VARCHAR(30),
    price NUMERIC(10, 2),
    stock NUMERIC(5)
);

CREATE TYPE person_type AS (
    name VARCHAR(50)
);

CREATE TABLE persons OF person_type;

CREATE TYPE address_type AS (
    address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10)
);

CREATE TABLE user_addresses (
    id SERIAL PRIMARY KEY,
    full_address address_type
);

CREATE TYPE course_Type AS (
    course_id INT,
    description VARCHAR(255)
);

CREATE TABLE courses OF course_Type;

Select * from users