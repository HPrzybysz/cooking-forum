const db = require('../config/db');

global.cleanup = async () => {
    try {
        if (db && typeof db.end === 'function') {
            await db.end();
        }
    } catch (err) {
        console.error('Cleanup error:', err);
    }
};

module.exports = async () => {
    try {
        await db.execute('DELETE FROM users WHERE email LIKE "%@test.com"');
        await db.execute('DELETE FROM recipes WHERE title LIKE "Test%"');
    } catch (err) {
        console.error('Setup error:', err);
    }
};