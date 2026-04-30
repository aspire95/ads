const { Pool } = require('pg');

const pool = new Pool({
    user: '23510014',
    host: 'localhost',
    database: 'DB23510014',
    password: 'mayur',
    port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool // Export pool for specialized operations if needed (e.g. connecting specifically)
};
