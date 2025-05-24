const db = require('../config/db');

class Favorite {
    static async addFavorite(userId, recipeId) {
        await db.execute(
            'INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)',
            [userId, recipeId]
        );
        await db.execute(
            'UPDATE recipe_statistics SET favorite_count = favorite_count + 1 WHERE recipe_id = ?',
            [recipeId]
        );
    }

    static async removeFavorite(userId, recipeId) {
        await db.execute(
            'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );
        await db.execute(
            'UPDATE recipe_statistics SET favorite_count = favorite_count - 1 WHERE recipe_id = ?',
            [recipeId]
        );
    }

    static async getUserFavorites(userId) {
        const [rows] = await db.execute(
            `SELECT r.* FROM recipes r
             JOIN favorites f ON r.id = f.recipe_id
             WHERE f.user_id = ?`,
            [userId]
        );
        return rows;
    }

    static async isFavorite(userId, recipeId) {
        const [rows] = await db.execute(
            'SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );
        return rows.length > 0;
    }
}

module.exports = Favorite;