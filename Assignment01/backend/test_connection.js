const pool = require('./db');

(async () => {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        console.log(`Host: ${pool.options.host}`);
        console.log(`User: ${pool.options.user}`);
        console.log(`Database: ${pool.options.database}`);
        console.log(`Port: ${pool.options.port}`);

        const res = await pool.query('SELECT NOW()');
        console.log('Connection Successful!');
        console.log('Server Time:', res.rows[0].now);
        process.exit(0);
    } catch (err) {
        console.error('Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        if (err.code === '28P01') {
            console.error('Hint: Password authentication failed. Check your password in db.js');
        } else if (err.code === '3D000') {
            console.error('Hint: Database does not exist. Create the database in pgAdmin or psql.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Hint: Is PostgreSQL running? Is it on port 5432?');
        }
        process.exit(1);
    }
})();
