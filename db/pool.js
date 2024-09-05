const { Pool } = require("pg");

module.exports  = new Pool({
    user: 'barrmohammed',
    host: 'localhost',
    database: 'mydiary_database',
    password: 'Allahis#1',
    port: 5432,
});
