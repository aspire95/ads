const express = require('express');
const router = express.Router();
const pool = require('../db');

// Submit Exam Result
router.post('/', async (req, res) => {
    const { user_id, exam_id, score, total_questions } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO results04 (user_id, exam_id, score, total_questions) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, exam_id, score, total_questions]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Results by User
router.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(`
      SELECT r.*, e.title as exam_title 
      FROM results04 r 
      JOIN exams04 e ON r.exam_id = e.id 
      WHERE r.user_id = $1`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Results (For Reports/Teachers)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT r.*, u.username, e.title as exam_title 
      FROM results04 r 
      JOIN users04 u ON r.user_id = u.id 
      JOIN exams04 e ON r.exam_id = e.id
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
