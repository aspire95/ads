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
    const { teacher_id } = req.query;
    try {
        let result;
        if (teacher_id) {
            result = await pool.query('SELECT * FROM exams04 WHERE created_by = $1', [teacher_id]);
        } else {
            result = await pool.query('SELECT * FROM exams04');
        }
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
// Update Exam
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, subject, duration_minutes } = req.body;
    try {
        const result = await pool.query(
            'UPDATE exams04 SET title = $1, description = $2, subject = $3, duration_minutes = $4 WHERE id = $5 RETURNING *',
            [title, description, subject, duration_minutes, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Exam
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM exams04 WHERE id = $1', [id]);
        res.json({ message: 'Exam deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
