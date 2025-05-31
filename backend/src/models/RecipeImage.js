const db = require('../config/db');

class RecipeImage {
    static async create({recipe_id, image_data, is_primary = false}) {
        const [result] = await db.execute(
            'INSERT INTO recipe_images (recipe_id, image_data, is_primary) VALUES (?, ?, ?)',
            [recipe_id, image_data, is_primary]
        );
        return result.insertId;
    }

    static async getByRecipeId(recipe_id) {
        const [rows] = await db.execute(
            'SELECT id, recipe_id, image_data, is_primary, created_at FROM recipe_images WHERE recipe_id = ? ORDER BY is_primary DESC',
            [recipe_id]
        );
        return rows;
    }

    static async setPrimaryImage(recipe_id, image_id) {
        await db.query('START TRANSACTION');
        try {
            await db.execute(
                'UPDATE recipe_images SET is_primary = FALSE WHERE recipe_id = ?',
                [recipe_id]
            );
            await db.execute(
                'UPDATE recipe_images SET is_primary = TRUE WHERE id = ? AND recipe_id = ?',
                [image_id, recipe_id]
            );
            await db.query('COMMIT');
            return true;
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async delete(image_id) {
        const [result] = await db.execute(
            'DELETE FROM recipe_images WHERE id = ?',
            [image_id]
        );
        return result.affectedRows > 0;
    }

    static async deleteAllForRecipe(recipe_id) {
        const [result] = await db.execute(
            'DELETE FROM recipe_images WHERE recipe_id = ?',
            [recipe_id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = RecipeImage;