const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const examRoutes = require('./routes/exams');
const resultRoutes = require('./routes/results');
const userRoutes = require('./routes/users');
const assignmentRoutes = require('./routes/assignments');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Check Database Connection and Auto-create necessary tables
pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS exam_assignments04 (
                id SERIAL PRIMARY KEY,
                exam_id INTEGER NOT NULL,
                student_id INTEGER NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(exam_id, student_id)
            )
        `);
        console.log('Exam assignments table ensured.');
    } catch (tblErr) {
        console.error('Error creating assignment table:', tblErr.message);
    }

    release();
});

// Routes will be added here
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);

// Global error handling middleware for unhandled Promise rejections and route errors
app.use((err, req, res, next) => {
    console.error('Unhandled Global Error:', err.stack || err.message || err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
