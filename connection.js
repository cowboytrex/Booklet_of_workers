const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'C.c7t72s4s6',
    port: 5432,
});

module.exports = pool;
