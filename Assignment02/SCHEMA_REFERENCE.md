# Assignment 2 Database Schema Reference (For pgAdmin4)

Copy and paste these blocks into the Query Tool in pgAdmin4 to view or manually create tables.

### Table: test_table
```sql
CREATE TABLE test_table (
    RecordNumber NUMERIC(3),
    CurrentDate DATE
);
```

### Table: products
```sql
CREATE TABLE products (
    ProductID NUMERIC(4) PRIMARY KEY,
    category CHAR(3),
    detail VARCHAR(30),
    price NUMERIC(10, 2),
    stock NUMERIC(5)
);
```

### Table: persons (Object Table)
**Note**: Requires `person_type` to be created first.
```sql
CREATE TYPE person_type AS (
    name VARCHAR(50)
);

CREATE TABLE persons OF person_type;
```

### Table: user_addresses (With Address Type)
**Note**: Requires `address_type` to be created first.
```sql
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
```

### Table: courses (Object Table)
**Note**: Requires `course_Type` to be created first.
```sql
CREATE TYPE course_Type AS (
    course_id INT,
    description VARCHAR(255)
);

CREATE TABLE courses OF course_Type;
```
