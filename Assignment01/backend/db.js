const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DB23510014',
  password: 'mayur',
  port: 5432,
});

module.exports = pool;
