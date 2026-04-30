const { Pool } = require('pg');

// Configures the connection with your credentials
const pool = new Pool({
  user: '23510014',       
  host: 'localhost',     
  database: 'DB23510014', 
  password: 'mayur',      
  port: 5432,             
});

module.exports = pool; 
