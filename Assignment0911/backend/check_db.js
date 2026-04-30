const cassandra = require('cassandra-driver');
const dotenv = require('dotenv');

dotenv.config();

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'ks_23510014' // Replace with your Keyspace if different
});

async function viewData() {
    try {
        await client.connect();
        console.log("✅ Custom CQL Script Connected to Cassandra!");
        
        const query = 'SELECT * FROM students;';
        const result = await client.execute(query);
        
        console.log("\n---📋 STUDENT DATA IN CASSANDRA ---");
        if(result.rowLength === 0) {
            console.log("No data found yet! Submit the form first.");
        } else {
            console.table(result.rows);
        }
        console.log("------------------------------------\n");
        process.exit(0);
    } catch (error) {
        console.error("Error running query:", error);
        process.exit(1);
    }
}

viewData();
