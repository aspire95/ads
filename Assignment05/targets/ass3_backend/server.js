const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Authentication ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users03 WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({ success: true, user: { user_id: user.user_id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Departments CRUD ---
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments03 ORDER BY dept_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/departments', async (req, res) => {
    const { dept_name } = req.body;
    try {
        const result = await pool.query('INSERT INTO departments03 (dept_name) VALUES ($1) RETURNING *', [dept_name]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { dept_name } = req.body;
    try {
        const result = await pool.query('UPDATE departments03 SET dept_name = $1 WHERE dept_id = $2 RETURNING *', [dept_name, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM departments03 WHERE dept_id = $1', [id]);
        res.json({ message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Students CRUD ---
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT s.*, d.dept_name FROM students03 s LEFT JOIN departments03 d ON s.dept_id = d.dept_id ORDER BY s.student_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    const { name, email, dept_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO students03 (name, email, dept_id) VALUES ($1, $2, $3) RETURNING *', [name, email, dept_id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, dept_id } = req.body;
    try {
        const result = await pool.query('UPDATE students03 SET name = $1, email = $2, dept_id = $3 WHERE student_id = $4 RETURNING *', [name, email, dept_id, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM students03 WHERE student_id = $1', [id]);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Users CRUD (For Role Based Access) ---
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, username, role FROM users03 ORDER BY user_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const result = await pool.query('INSERT INTO users03 (username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role', [username, password, role]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, role } = req.body;
    try {
        const result = await pool.query('UPDATE users03 SET username = $1, role = $2 WHERE user_id = $3 RETURNING user_id, username, role', [username, role, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users03 WHERE user_id = $1', [id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Generic Report ---
app.get('/api/report', async (req, res) => {
    const { table } = req.query;
    if (!['students', 'departments', 'users'].includes(table)) {
        return res.status(400).json({ error: 'Invalid table requested' });
    }

    try {
        let query = '';
        if (table === 'students') {
            query = 'SELECT s.student_id, s.name, s.email, d.dept_name FROM students03 s LEFT JOIN departments03 d ON s.dept_id = d.dept_id';
        } else if (table === 'departments') {
            query = 'SELECT * FROM departments03';
        } else if (table === 'users') {
            query = 'SELECT * FROM users03';
        }

        const result = await pool.query(query);
        res.json({
            columns: result.fields.map(f => f.name),
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
