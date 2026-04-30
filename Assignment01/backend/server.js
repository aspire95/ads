    const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/stud1', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Stud1');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/stud1', async (req, res) => {
    try {
        const { name, prn } = req.body;
        const result = await pool.query(
            'INSERT INTO Stud1 (name, prn) VALUES ($1, $2) RETURNING *',
            [name, prn]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/stud1/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, prn } = req.body;
        const result = await pool.query(
            'UPDATE Stud1 SET name = $1, prn = $2 WHERE id = $3 RETURNING *',
            [name, prn, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/stud1/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Stud1 WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
