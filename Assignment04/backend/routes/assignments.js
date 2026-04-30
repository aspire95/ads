const express = require('express');
const router = express.Router();
const pool = require('../db');

// Assign exam to multiple students
router.post('/', async (req, res) => {
    const { exam_id, student_ids } = req.body;
    try {
        if (!exam_id || !Array.isArray(student_ids)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        // Insert assignments ignoring duplicates using ON CONFLICT DO NOTHING
        for (let student_id of student_ids) {
            await pool.query(
                `INSERT INTO exam_assignments04 (exam_id, student_id) 
                 VALUES ($1, $2) ON CONFLICT (exam_id, student_id) DO NOTHING`,
                [exam_id, student_id]
            );
        }

        res.json({ message: 'Assigned successfully' });
    } catch (err) {
        console.error('assignment error', err.message);
        res.status(500).send('Server Error');
    }
});

// Unassign exam from student
router.delete('/:exam_id/:student_id', async (req, res) => {
    const { exam_id, student_id } = req.params;
    try {
        await pool.query('DELETE FROM exam_assignments04 WHERE exam_id = $1 AND student_id = $2', [exam_id, student_id]);
        res.json({ message: 'Unassigned effectively' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get assigned exams for a student
router.get('/student/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.* 
            FROM exams04 e 
            JOIN exam_assignments04 a ON e.id = a.exam_id 
            WHERE a.student_id = $1
        `, [student_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get students assigned to a specific exam
router.get('/exam/:exam_id', async (req, res) => {
    const { exam_id } = req.params;
    try {
        const result = await pool.query(`
            SELECT u.id, u.username 
            FROM users04 u 
            JOIN exam_assignments04 a ON u.id = a.student_id 
            WHERE a.exam_id = $1
        `, [exam_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
