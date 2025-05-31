const db = require('../config/db');

class Recipe {
    static async create({userId, title, description, prepTime, servings, equipment, authorNote, categoryId}) {
        await db.query('START TRANSACTION');
        try {
            equipment = equipment !== undefined ? equipment : null;
            authorNote = authorNote !== undefined ? authorNote : null;
            categoryId = categoryId !== undefined ? categoryId : null;

            const [result] = await db.execute(
                'INSERT INTO recipes (user_id, title, description, prep_time, servings, equipment, author_note, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, title, description, prepTime, servings, equipment, authorNote, categoryId]
            );

            await db.query('COMMIT');
            return result.insertId;
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }


    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT r.*, 
       u.first_name AS author_first_name, 
       u.last_name AS author_last_name,
       u.avatar_url AS author_avatar,
       c.name AS category_name
       FROM recipes r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async update(id, {title, description, prepTime, servings, equipment, authorNote, categoryId}) {
        const updates = [];
        const params = [];

        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (prepTime !== undefined) {
            updates.push('prep_time = ?');
            params.push(prepTime);
        }
        if (servings !== undefined) {
            updates.push('servings = ?');
            params.push(servings);
        }
        if (equipment !== undefined) {
            updates.push('equipment = ?');
            params.push(equipment);
        }
        if (authorNote !== undefined) {
            updates.push('author_note = ?');
            params.push(authorNote);
        }
        if (categoryId !== undefined) {
            updates.push('category_id = ?');
            params.push(categoryId);
        }

        if (updates.length === 0) {
            throw new Error('No valid fields provided for update');
        }

        params.push(id);

        const query = `UPDATE recipes SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM recipes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async getAll() {
        const [rows] = await db.execute(
            `SELECT r.*, 
       u.first_name AS author_first_name, 
       u.last_name AS author_last_name,
       c.name AS category_name
       FROM recipes r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN categories c ON r.category_id = c.id
       ORDER BY r.created_at DESC`
        );
        return rows;
    }
}

module.exports = Recipe;