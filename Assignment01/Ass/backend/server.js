const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---

// 1. Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users03 WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            // In a real app, do not send password back!
            res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// 2. Students CRUD

// GET all students (with department names)
app.get('/api/students', async (req, res) => {
    try {
        const query = `
      SELECT s.id, s.first_name, s.last_name, s.email, d.name as department_name, s.dob 
      FROM students03 s
      LEFT JOIN departments03 d ON s.department_id = d.id
      ORDER BY s.id ASC
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST new student
app.post('/api/students', async (req, res) => {
    const { first_name, last_name, email, department_id, dob } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students03 (first_name, last_name, email, department_id, dob) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email, department_id, dob]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, department_id, dob } = req.body;
    try {
        const result = await pool.query(
            'UPDATE students03 SET first_name = $1, last_name = $2, email = $3, department_id = $4, dob = $5 WHERE id = $6 RETURNING *',
            [first_name, last_name, email, department_id, dob, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM students03 WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ success: true, message: 'Student deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. Departments Endpoint (for dropdowns)
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments03 ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 4. Report Endpoint (Dynamic Table View)
app.get('/api/report', async (req, res) => {
    const { table } = req.query;
    // Basic whitelist to prevent SQL injection - updated with 03 suffix
    const allowedTables = ['students03', 'departments03', 'users03'];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
