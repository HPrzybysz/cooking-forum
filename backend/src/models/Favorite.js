const db = require('../config/db');

class Favorite {
    static async addFavorite(userId, recipeId) {
        await db.query('START TRANSACTION');
        try {
            await db.execute(
                'INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)',
                [userId, recipeId]
            );

            await db.execute(
                `INSERT INTO recipe_statistics (recipe_id, favorite_count) 
                 VALUES (?, 1)
                 ON DUPLICATE KEY UPDATE favorite_count = favorite_count + 1`,
                [recipeId]
            );

            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async removeFavorite(userId, recipeId) {
        await db.query('START TRANSACTION');
        try {
            const [deleteResult] = await db.execute(
                'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
                [userId, recipeId]
            );

            if (deleteResult.affectedRows > 0) {
                await db.execute(
                    `UPDATE recipe_statistics 
                     SET favorite_count = favorite_count - 1 
                     WHERE recipe_id = ? AND favorite_count > 0`,
                    [recipeId]
                );
            }

            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
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

    static async getFavoriteCount(recipeId) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM favorites WHERE recipe_id = ?',
            [recipeId]
        );
        return rows[0]?.count || 0;
    }

    static async syncFavoriteCounts() {
        try {
            await db.query('START TRANSACTION');

            const [recipesWithFavorites] = await db.execute(
                `SELECT recipe_id, COUNT(*) as count 
                 FROM favorites 
                 GROUP BY recipe_id`
            );

            for (const {recipe_id, count} of recipesWithFavorites) {
                await db.execute(
                    `INSERT INTO recipe_statistics (recipe_id, favorite_count) 
                     VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE favorite_count = ?`,
                    [recipe_id, count, count]
                );
            }

            await db.execute(
                `UPDATE recipe_statistics rs
                 LEFT JOIN favorites f ON rs.recipe_id = f.recipe_id
                 SET rs.favorite_count = 0
                 WHERE f.recipe_id IS NULL`
            );

            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = Favorite;