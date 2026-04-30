const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all students
router.get('/students', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, role, created_at FROM users04 WHERE role = 'student' ORDER BY username ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
