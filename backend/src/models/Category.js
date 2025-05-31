const db = require('../config/db');

class Category {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM categories');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({name, imageData}) {
        const [result] = await db.execute(
            'INSERT INTO categories (name, image_url) VALUES (?, ?)',
            [name, imageData]
        );
        return result.insertId;
    }

    static async update(id, {name, imageData}) {
        if (imageData) {
            const [result] = await db.execute(
                'UPDATE categories SET name = ?, image_url = ? WHERE id = ?',
                [name, imageData, id]
            );
            return result;
        } else {
            const [result] = await db.execute(
                'UPDATE categories SET name = ? WHERE id = ?',
                [name, id]
            );
            return result;
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getRecipesByCategory(categoryId) {
        const [rows] = await db.execute(
            'SELECT r.* FROM recipes r WHERE r.category_id = ?',
            [categoryId]
        );
        return rows;
    }
}

module.exports = Category;