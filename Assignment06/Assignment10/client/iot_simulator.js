const cassandra = require('cassandra-driver');

// Connect to the cluster via Docker (assuming they are running on localhost)
// Change host to the respective node if testing individually without local ports 9042 exposed.
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], // Can specify multiple IPs here
    localDataCenter: 'DC1',
    keyspace: 'weather_db'
});

const STATIONS = ['ST-001', 'ST-002', 'ST-003', 'ST-004', 'ST-005'];

async function insertData() {
    try {
        const station = STATIONS[Math.floor(Math.random() * STATIONS.length)];
        const temperature = (Math.random() * (45 - (-10)) + (-10)).toFixed(2); // Random temp between -10 and 45
        
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const eventTime = now;

        const query = 'INSERT INTO temperature_data (weatherStationID, date, event_time, temperature) VALUES (?, ?, ?, ?)';
        const params = [station, dateStr, eventTime, temperature];

        await client.execute(query, params, { prepare: true });
        console.log(`[${eventTime.toISOString()}] Inserted: ${station} | Temp: ${temperature}°C`);
    } catch (err) {
        console.error('Failed to insert data', err);
    }
}

async function startSimulation() {
    console.log("Connecting to Cassandra Cluster (2026GRP01) at 127.0.0.1 ...");
    try {
        await client.connect();
        console.log("Connected to Cassandra Cluster!");
        console.log("Starting IoT Simulation (pushing data every 2 seconds to simulate 5-min intervals) ...");
        
        setInterval(insertData, 2000); // Trigger data insertion every 2s
    } catch (err) {
        console.error("Connection Error: Make sure Cassandra cluster is running and schema is applied.", err);
    }
}

// Ensure clean exit
process.on('SIGINT', () => {
    console.log("Closing Cassandra Client...");
    client.shutdown();
    process.exit();
});

startSimulation();
