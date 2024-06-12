const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.log(err);
        console.log('Error Connecting to Mysql');
    } else {
        console.log('Connected to MySql');
    }
});

module.exports = db;
