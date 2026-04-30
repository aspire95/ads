const db = require('../config/db');

exports.createTask = async (req, res) => {
    const { title, description, courseId, dueDate } = req.body;
    const instructorId = req.user.refId;

    try {
        await db.query(
            'INSERT INTO tasks (title, description, course_id, instructor_id, due_date) VALUES ($1, $2, $3, $4, $5)',
            [title, description, courseId, instructorId, dueDate]
        );
        res.status(201).json({ message: 'Task assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    const { role, refId } = req.user;
    try {
        let query = `
            SELECT t.*, c.title as course_title, i.name as instructor_name 
            FROM tasks t
            JOIN course c ON t.course_id = c.course_id
            JOIN instructor i ON t.instructor_id = i.ID
        `;
        let params = [];

        if (role === 'Faculty') {
            query += ' WHERE t.instructor_id = $1';
            params = [refId];
        } else if (role === 'Student') {
            query += ` WHERE t.course_id IN (SELECT course_id FROM takes WHERE ID = $1)`;
            params = [refId];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitTask = async (req, res) => {
    const { taskId, content } = req.body;
    const studentId = req.user.refId;

    try {
        await db.query(
            'INSERT INTO task_submissions (task_id, student_id, content) VALUES ($1, $2, $3) ON CONFLICT (task_id, student_id) DO UPDATE SET content = $3, submission_date = CURRENT_TIMESTAMP',
            [taskId, studentId, content]
        );
        res.json({ message: 'Submission updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubmissions = async (req, res) => {
    const { taskId } = req.params;
    try {
        const result = await db.query(
            `SELECT ts.*, s.name as student_name 
             FROM task_submissions ts
             JOIN student s ON ts.student_id = s.ID
             WHERE ts.task_id = $1`, [taskId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    const { submissionId, grade, feedback } = req.body;
    try {
        await db.query(
            'UPDATE task_submissions SET grade = $1, feedback = $2 WHERE submission_id = $3',
            [grade, feedback, submissionId]
        );
        res.json({ message: 'Grade recorded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
