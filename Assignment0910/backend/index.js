const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const PRN = process.env.PRN || '23510014';

// --- MongoDB Configuration ---
// The database name is set as the PRN
const mongoUri = process.env.MONGODB_URI || `mongodb://localhost:27017/${PRN}`;

mongoose.connect(mongoUri)
    .then(() => {
        const dbName = mongoose.connection.name || PRN;
        console.log(`✅ Connected to MongoDB Atlas (DB: ${dbName})`);
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Student Schema
const StudentSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    prn: { type: String, required: true },
    name: { type: String, required: true },
    course: String,
    email: String
});
const Student = mongoose.model('Student', StudentSchema);

// --- API Endpoints ---

// 1. CREATE
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student({ ...req.body, id: uuidv4() });
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. READ ALL
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findOneAndUpdate({ id }, req.body, { new: true });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Student.findOneAndDelete({ id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
