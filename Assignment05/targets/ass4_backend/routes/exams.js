const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create Exam
router.post('/', async (req, res) => {
    const { title, description, subject, duration_minutes, created_by } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO exams04 (title, description, subject, duration_minutes, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, subject, duration_minutes, created_by]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Exams
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exams04');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Exam by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM exams04 WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
