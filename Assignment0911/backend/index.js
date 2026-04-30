const express = require('express');
const cassandra = require('cassandra-driver');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
// We read your PRN to name your Keyspace if testing locally. 
// For Astra DB, you'll specify the KEYSPACE you created on the dashboard in your .env file.
const PRN = process.env.PRN || '23510014';
const KEYSPACE = process.env.ASTRA_DB_KEYSPACE || `ks_${PRN}`;

const useCloud = process.env.ASTRA_DB_SECURE_BUNDLE_PATH;

// --- Cassandra / Astra DB Configuration ---
let clientOptions = {
    keyspace: KEYSPACE
};

if (useCloud) {
    // If you placed the Astra DB Zip path in .env, connect via Cloud!
    clientOptions.cloud = {
        secureConnectBundle: process.env.ASTRA_DB_SECURE_BUNDLE_PATH
    };
    clientOptions.credentials = {
        username: process.env.ASTRA_DB_CLIENT_ID,
        password: process.env.ASTRA_DB_CLIENT_SECRET
    };
} else {
    // Local Cassandra fallback
    clientOptions.contactPoints = [process.env.CASSANDRA_CONTACT_POINT || '127.0.0.1'];
    clientOptions.localDataCenter = process.env.CASSANDRA_DATACENTER || 'datacenter1';
}

const client = new cassandra.Client(clientOptions);

async function initializeDatabase() {
    try {
        if (!useCloud) {
            // Local Cassandra Initialization - we create the Keyspace manually.
            // Astra DB creates the keyspace on the cloud dashboard so you won't need this step!
            const initClient = new cassandra.Client({
                contactPoints: [process.env.CASSANDRA_CONTACT_POINT || '127.0.0.1'],
                localDataCenter: process.env.CASSANDRA_DATACENTER || 'datacenter1',
            });
            await initClient.connect();
            const createKeyspaceQuery = `
                CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE} 
                WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
            `;
            await initClient.execute(createKeyspaceQuery);
            await initClient.shutdown();
        }

        // Connect the actual client pointing to the specific keyspace
        await client.connect();
        console.log(`✅ Connected to Cassandra Database (${useCloud ? 'Astra Cloud' : 'Local'})! (Keyspace: ${KEYSPACE})`);
        
        // 2. Create Table (Astra DB supports this!)
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS students (
                id uuid PRIMARY KEY,
                prn text,
                name text,
                course text,
                email text
            )
        `;
        await client.execute(createTableQuery);
        console.log(`✅ Cassandra Table 'students' ensured`);
        
    } catch (err) {
        console.error('❌ Cassandra Initialization Error:', err);
    }
}

initializeDatabase();



// 1. CREATE
app.post('/api/students', async (req, res) => {
    try {
        const { prn, name, course, email } = req.body;
        const id = cassandra.types.Uuid.random();
        
        const query = 'INSERT INTO students (id, prn, name, course, email) VALUES (?, ?, ?, ?, ?)';
        await client.execute(query, [id, prn, name, course, email], { prepare: true });
        
        res.status(201).json({ id: id.toString(), prn, name, course, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. READ ALL
app.get('/api/students', async (req, res) => {
    try {
        const query = 'SELECT * FROM students';
        const result = await client.execute(query);
        const students = result.rows.map(row => ({
            id: row.id.toString(),
            prn: row.prn,
            name: row.name,
            course: row.course,
            email: row.email
        }));
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { prn, name, course, email } = req.body;
        
        const query = 'UPDATE students SET prn = ?, name = ?, course = ?, email = ? WHERE id = ?';
        const uuidId = cassandra.types.Uuid.fromString(id);
        
        await client.execute(query, [prn, name, course, email, uuidId], { prepare: true });
        
        res.json({ id, prn, name, course, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM students WHERE id = ?';
        const uuidId = cassandra.types.Uuid.fromString(id);
        
        await client.execute(query, [uuidId], { prepare: true });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
