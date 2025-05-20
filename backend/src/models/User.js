const db = require('../config/db');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/encryption');

class User {
    static async create({firstName, lastName, email, password}) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password_hash);
    }

    static async generateAuthToken(userId) {
        return generateToken({id: userId});
    }

    static async updateProfile(userId, {firstName, lastName, email, avatarData}) {
        if (avatarData) {
            const [result] = await db.execute(
                'UPDATE users SET first_name = ?, last_name = ?, email = ?, avatar_url = ? WHERE id = ?',
                [firstName, lastName, email, avatarData, userId]
            );
            return result;
        } else {
            const [result] = await db.execute(
                'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
                [firstName, lastName, email, userId]
            );
            return result;
        }
    }
}

module.exports = User;