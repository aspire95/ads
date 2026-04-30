const express = require('express');
const router = express.Router();
const pool = require('../db');

// Register User
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users04 (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, password, role]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users04 WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // In a real app, compare hashed passwords. Here checking plain text for simplicity as per lab.
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user info (and token in real app)
        res.json({ id: user.id, username: user.username, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
