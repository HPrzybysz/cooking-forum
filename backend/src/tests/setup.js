const { Pool } = require('pg');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mysql = require('mysql2/promise');

module.exports = async () => {
    global.testDb = await mysql.createPool({
        host: process.env.TEST_DB_HOST || 'localhost',
        user: process.env.TEST_DB_USER || 'root',
        password: process.env.TEST_DB_PASSWORD || '',
        database: process.env.TEST_DB_NAME || 'cooking_forum_test',
        connectionLimit: 5,
    });

    global.cleanup = async () => {
        await global.testDb.end();
    };
};