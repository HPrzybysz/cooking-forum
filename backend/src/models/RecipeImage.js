const db = require('../config/db');

class RecipeImage {
    static async create({ recipeId, imageUrl = null, imageData = null, isPrimary = false }) {
        if (!imageUrl && !imageData) {
            throw new Error('Either imageUrl or imageData must be provided');
        }

        const [result] = await db.execute(
            'INSERT INTO recipe_images (recipe_id, image_url, image_data, is_primary) VALUES (?, ?, ?, ?)',
            [recipeId, imageUrl, imageData, isPrimary]
        );
        return result.insertId;
    }

    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            'SELECT * FROM recipe_images WHERE recipe_id = ? ORDER BY is_primary DESC',
            [recipeId]
        );
        return rows;
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
}

module.exports = RecipeImage;