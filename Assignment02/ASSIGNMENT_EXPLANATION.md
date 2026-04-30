# Assignment 2: Detailed Explanation & Outline

This document provides a comprehensive breakdown of the assignment, explaining the concepts (Part I & II) and how they are implemented in this project.

## Outline

1.  **Introduction**: Overview of the project goals.
2.  **Part I: PL/pgSQL Review**:
    *   (a) Procedural Logic (Loops & Inserts).
    *   (b) Conditional Logic (Updates & Parameters).
3.  **Part II: Object-Relational Database Features**:
    *   (a) Object Tables & Member Functions.
    *   (b) Composite Types & Field Methods.
    *   (c) Typed Tables.
4.  **Conclusion**: Summary of learning outcomes.

---

## 1. Introduction

The goal of this assignment is to bridge the gap between application logic (Node.js) and advanced database logic (PostgreSQL). Instead of doing everything in the application code, we move significant logic *into* the database using **Stored Procedures**, **Functions**, and **User-Defined Types**. This leverages the Database Management System (DBMS) for better performance and data integrity.

---

## 2. Part I: PL/pgSQL Review

**PL/pgSQL** (Procedural Language/PostgreSQL) allows us to write code that looks like a programming language (with loops, variables, if-statements) directly inside the database.

### (a) Loop Insert (`test_table`)
*   **Concept**: Automation using Loops.
*   **Requirement**: Create a table `test_table` and write a procedure to insert 50 records automatically.
*   **Implementation**:
    *   We created a procedure `insert_50_to_test_table()`.
    *   It uses a `FOR` loop (`1..50`).
    *   Inside the loop, it executes an `INSERT` statement dynamically.
    *   **Result**: 50 rows generated with a single command (`CALL insert_50_to_test_table()`), reducing network traffic between Node.js and Postgres.

### (b) Conditional Logic (`products`)
*   **Concept**: Parameterized Updates.
*   **Requirement**: Increase the price of products in a specific category (Y) by a specific percentage (X).
*   **Implementation**:
    *   Table `products` holds inventory data.
    *   Procedure `increase_price(X, Y)` takes two inputs.
    *   It executes a single `UPDATE` query with mathematical logic: `price = price + (price * X/100)`.
    *   **Result**: Business logic (calculating the new price) is handled safely by the DB.

---

## 3. Part II: Object-Relational Database Features

Standard SQL uses simple tables. **Object-Relational** databases (like PostgreSQL) allow us to define custom complex types, similar to Classes in programming (Java/C++).

### (a) Object Tables (`persons`)
*   **Concept**: Objects in Database.
*   **Requirement**: A table where rows are "Objects" of a specific type, with associated methods.
*   **Implementation**:
    *   Created Type `person_type` (field: `name`).
    *   Created **Object Table** `persons` strictly typed to `person_type`.
    *   Created Function `countNoOfWords(name)` which acts like a method effectively.
    *   **Result**: Data is structured rigidly according to the type definition.

### (b) Composite Types (`address_type`)
*   **Concept**: Complex Data Structures.
*   **Requirement**: A single column that holds multiple values (Street, City, State, Zip).
*   **Implementation**:
    *   Created Type `address_type` with 4 attributes.
    *   Table `user_addresses` has a column `full_address` of this type.
    *   **Methods**:
        *   `extract_addresses_by_keyword`: Searches inside the complex object.
        *   `count_words_in_field`: Dynamically checks a specific part (e.g., just the City) of the composite object.
    *   **Result**: We can treat an Address as a single unit or access its parts, offering flexibility.

### (c) Typed Tables (`courses`)
*   **Concept**: Strict Typing.
*   **Requirement**: A table definition based entirely on a User-Defined Type.
*   **Implementation**:
    *   Created Type `course_Type` (id, description).
    *   Created Table `courses` OF `course_Type`.
    *   **Result**: Ensures that the table structure remains perfectly synchronized with the Type definition.

---

## 4. Conclusion

By completing this assignment, we have demonstrated:
1.  **Efficiency**: Moving looping and math logic to the database (Part I).
2.  **Structure**: Using Types to create complex, reusable data structures (Part II).
3.  **Integration**: Connecting a modern frontend (Node.js CLI) to these advanced backend features.
