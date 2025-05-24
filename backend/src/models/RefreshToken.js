const db = require('../config/db');
const crypto = require('crypto');

class RefreshToken {
    static async create(userId, expiresAt) {
        const token = crypto.randomBytes(40).toString('hex');
        await db.execute(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
        return token;
    }

    static async findByToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM refresh_tokens WHERE token = ?',
            [token]
        );
        return rows[0];
    }

    static async delete(token) {
        await db.execute(
            'DELETE FROM refresh_tokens WHERE token = ?',
            [token]
        );
    }

    static async deleteAllForUser(userId) {
        await db.execute(
            'DELETE FROM refresh_tokens WHERE user_id = ?',
            [userId]
        );
    }
}

module.exports = RefreshToken;