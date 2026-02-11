const { Pool } = require('pg');
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Use path.resolve to ensure .env is found even if running from different directories
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // AIVEN REQUIRES SSL
    ssl: {
        rejectUnauthorized: true,
        // Ensure ca.pem is in the same folder as this db.js file
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')).toString(),
    }
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', () => {
    console.log('✅ Connected to Aiven PostgreSQL');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
    end: () => pool.end(),
};