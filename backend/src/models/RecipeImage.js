const db = require('../config/db');

class RecipeImage {
    static async create({recipeId, imageData, isPrimary = false}) {
        const [result] = await db.execute(
            'INSERT INTO recipe_images (recipe_id, image_data, is_primary) VALUES (?, ?, ?)',
            [recipeId, imageData, isPrimary]
        );
        return result.insertId;
    }


    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            'SELECT id, recipe_id, image_data, is_primary, created_at FROM recipe_images WHERE recipe_id = ? ORDER BY is_primary DESC',
            [recipeId]
        );

        return rows.map(row => ({
            ...row,
            image_data: row.image_data ? Buffer.from(row.image_data) : null
        }));
    }

    static async setPrimaryImage(recipeId, imageId) {
        await db.query('START TRANSACTION');
        try {
            await db.execute(
                'UPDATE recipe_images SET is_primary = FALSE WHERE recipe_id = ?',
                [recipeId]
            );
            await db.execute(
                'UPDATE recipe_images SET is_primary = TRUE WHERE id = ? AND recipe_id = ?',
                [imageId, recipeId]
            );
            await db.query('COMMIT');
            return true;
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async delete(imageId) {
        const [result] = await db.execute(
            'DELETE FROM recipe_images WHERE id = ?',
            [imageId]
        );
        return result.affectedRows > 0;
    }

    static async deleteAllForRecipe(recipeId) {
        const [result] = await db.execute(
            'DELETE FROM recipe_images WHERE recipe_id = ?',
            [recipeId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = RecipeImage;