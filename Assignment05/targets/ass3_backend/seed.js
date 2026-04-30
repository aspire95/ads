const { Pool } = require('pg');

const pool = new Pool({
    user: '23510010',
    host: 'localhost',
    database: 'university_db',
    password: 'raren',
    port: 5432,
});

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Create Departments Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
          dept_id SERIAL PRIMARY KEY,
          dept_name VARCHAR(100) NOT NULL
      );
    `);

        // 2. Create Users Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'student' 
      );
    `);

        // 3. Create Students Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
          student_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE,
          dept_id INT REFERENCES departments(dept_id)
      );
    `);

        // 4. Insert Admin User
        await pool.query(`
      INSERT INTO users (username, password, role)
      VALUES ('admin', 'admin', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

        console.log('Values inserted.');
        console.log('Login credentials:');
        console.log('Username: admin');
        console.log('Password: admin');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await pool.end();
    }
}

seed();
