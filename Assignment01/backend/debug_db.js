const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Try postgres user first as it's likely owner
    host: 'localhost',
    database: 'DB23510014',
    password: 'mayur',
    port: 5432,
});

async function test() {
    try {
        console.log('Testing connection to DB23510014...');
        const result = await pool.query('SELECT * FROM Stud1');
        console.log('Success! Found Stud1 in DB23510014', result.rows);
    } catch (err) {
        console.error('ERROR in DB23510014:', err.message);
        if (err.code === '42P01') {
            // Table not found? Try Quoted.
            try {
                console.log('Trying Quoted "Stud1"...');
                const res2 = await pool.query('SELECT * FROM "Stud1"');
                console.log('Success with "Stud1"!', res2.rows);
            } catch (e2) {
                console.error('ERROR with "Stud1":', e2.message);
            }
        }
    } finally {
        pool.end();
    }
}

test();
