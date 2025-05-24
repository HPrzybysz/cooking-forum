const db = require('../config/db');
const crypto = require('crypto');

class PasswordResetToken {
    static async create(userId, expiresAt) {
        const token = crypto.randomBytes(32).toString('hex');
        await db.execute(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
        return token;
    }

    static async findByToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
            [token]
        );
        return rows[0];
    }

    static async markAsUsed(token) {
        await db.execute(
            'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
            [token]
        );
    }
}

module.exports = PasswordResetToken;