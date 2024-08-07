const { Pool } = require('pg');

const pool = new Pool({
    user: "myuser",
    host: "127.0.0.1",
    database: "mydb",
    password: "qwer123$",
    port: 5432,
});

module.exports = pool