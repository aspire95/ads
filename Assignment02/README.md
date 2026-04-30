# Assignment 2: ADS Lab (PL/pgSQL & Object Relational DB)

This console-based Node.js application implements the requirements for Assignment 2, connecting to a PostgreSQL database to demonstrate stored procedures, object types, and other advanced database features.

## Prerequisites
- Node.js installed.
- PostgreSQL installed and running.
- Database credentials configured in `src/db.js` (User: `23510014`, DB: `DB23510014`, Password: `mayur`).

## Installation

1.  Open your terminal in this directory.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

Start the application:
```bash
npm start
```

### Menu Options & Description

1.  **Initialize Database**: 
    - **CRITICAL**: Run this first!
    - It executes `sql/setup.sql`, creating all necessary tables (`test_table`, `products`, `persons`, etc.) and procedures.
    
2.  **Part I(a)**: Insert 50 records in `test_table`.
    - Demonstration of PL/pgSQL Loops.
    
3.  **Part I(b)**: Increase Product Prices.
    - Updates prices in `products` table for a specific category by X%.
    
4.  **Part II(a)**: Object Table (Word Count).
    - Inserts into `persons` object table and uses a stored function to count words in the name.
    
5.  **Part II(b)**: Address Type Functions.
    - Demonstrates composite types (`address_type`).
    - Option (i): Extract address by keyword.
    - Option (ii): Count words in a specific sub-field (e.g., city, state).
    
6.  **Part II(c)**: Course Type Object Table.
    - Lists data from strictly typed `courses` table.

## File Structure

- **src/index.js**: Main application entry point (CLI Menu).
- **src/db.js**: Database connection configuration.
- **sql/setup.sql**: The "Blueprint" containing all SQL schemas, Types, and Procedures.
