const db = require('../config/db');

class Tag {
    static async create(name) {
        const [result] = await db.execute(
            'INSERT INTO tags (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    }

    static async findOrCreate(name) {
        const [existing] = await db.execute(
            'SELECT id FROM tags WHERE name = ?',
            [name]
        );

        if (existing.length > 0) {
            return existing[0].id;
        }

        return await Tag.create(name);
    }

    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            `SELECT t.id, t.name 
             FROM tags t
             JOIN recipe_tags rt ON t.id = rt.tag_id
             WHERE rt.recipe_id = ?`,
            [recipeId]
        );
        return rows;
    }

    static async addToRecipe(recipeId, tagId) {
        await db.execute(
            'INSERT IGNORE INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)',
            [recipeId, tagId]
        );
    }

    static async removeFromRecipe(recipeId, tagId) {
        await db.execute(
            'DELETE FROM recipe_tags WHERE recipe_id = ? AND tag_id = ?',
            [recipeId, tagId]
        );
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM tags');
        return rows;
    }
}

module.exports = Tag;