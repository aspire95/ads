DROP TABLE IF EXISTS test_table;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS user_addresses; 
DROP TYPE IF EXISTS person_type CASCADE;
DROP TYPE IF EXISTS address_type CASCADE;
DROP TYPE IF EXISTS course_Type CASCADE;


CREATE TABLE test_table (
    RecordNumber NUMERIC(3),
    CurrentDate DATE
);

CREATE OR REPLACE PROCEDURE insert_50_to_test_table()
LANGUAGE plpgsql
AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO test_table (RecordNumber, CurrentDate)
        VALUES (i, CURRENT_DATE);
    END LOOP;
END;
$$;



CREATE TABLE products (
    ProductID NUMERIC(4) PRIMARY KEY,
    category CHAR(3),
    detail VARCHAR(30),
    price NUMERIC(10, 2),
    stock NUMERIC(5)
);

INSERT INTO products (ProductID, category, detail, price, stock) VALUES
(1001, 'ELE', 'Gaming Laptop', 85000.00, 10),
(1002, 'ELE', 'Wireless Mouse', 1500.00, 50),
(1003, 'FUR', 'Office Chair', 5000.00, 20),
(1004, 'FUR', 'Wooden Desk', 12000.00, 15),
(1005, 'KIT', 'Blender', 3000.00, 30);

CREATE OR REPLACE PROCEDURE increase_price(X NUMERIC, Y VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET price = price + (price * (X / 100))
    WHERE category = Y;
END;
$$;



CREATE TYPE person_type AS (
    name VARCHAR(50)
);

CREATE TABLE persons OF person_type;

CREATE OR REPLACE FUNCTION countNoOfWords(p_name VARCHAR)
RETURNS INT
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_name IS NULL OR trim(p_name) = '' THEN 
        RETURN 0; 
    END IF;
    RETURN array_length(regexp_split_to_array(trim(p_name), '\s+'), 1);
END;
$$;



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

INSERT INTO user_addresses (full_address) VALUES 
(ROW('123 Main Street', 'Mumbai', 'Maharashtra', '400001')),
(ROW('456 Sunset Boulevard', 'Pune', 'Maharashtra', '411001')),
(ROW('789 Broadway Ave', 'Bangalore', 'Karnataka', '560001'));

-- Method i: Extract addresses based on keyword (Function returning table)
CREATE OR REPLACE FUNCTION extract_addresses_by_keyword(keyword VARCHAR)
RETURNS TABLE(addr_summary TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (ua.full_address).address::TEXT
    FROM user_addresses ua
    WHERE (ua.full_address).address ILIKE '%' || keyword || '%'
       OR (ua.full_address).city ILIKE '%' || keyword || '%'
       OR (ua.full_address).state ILIKE '%' || keyword || '%';
END;
$$;

-- Method ii: Return no of words in given field
CREATE OR REPLACE FUNCTION count_words_in_field(addr address_type, field_name VARCHAR)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    text_val VARCHAR;
BEGIN
    IF field_name = 'address' THEN text_val := addr.address;
    ELSIF field_name = 'city' THEN text_val := addr.city;
    ELSIF field_name = 'state' THEN text_val := addr.state;
    ELSIF field_name = 'pincode' THEN text_val := addr.pincode;
    ELSE RETURN 0;
    END IF;
    
    IF text_val IS NULL OR trim(text_val) = '' THEN RETURN 0; END IF;
    RETURN array_length(regexp_split_to_array(trim(text_val), '\s+'), 1);
END;
$$;


-- c) Create a user defined data type course_Type with 2 attributes course_id, description :
-- i. Create an object table based on the type created.
-- ii. Insert rows into the table
CREATE TYPE course_Type AS (
    course_id INT,
    description VARCHAR(255)
);

CREATE TABLE courses OF course_Type;

INSERT INTO courses (course_id, description) VALUES
(101, 'Data Structures and Algorithms'),
(102, 'Database Management Systems'),
(103, 'Operating Systems');
