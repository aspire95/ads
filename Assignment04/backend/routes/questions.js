const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create Question
router.post('/', async (req, res) => {
    const { exam_id, question_text, options, correct_option, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO questions04 (exam_id, question_text, options, correct_option, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [exam_id, question_text, options, correct_option, image_url]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Questions by Exam ID
router.get('/:exam_id', async (req, res) => {
    const { exam_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM questions04 WHERE exam_id = $1', [exam_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Question
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM questions04 WHERE id = $1', [id]);
        res.json({ message: 'Question deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
