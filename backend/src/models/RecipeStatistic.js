const db = require('../config/db');

class RecipeStatistic {
    static async incrementViewCount(recipeId) {
        await db.execute(
            `INSERT INTO recipe_statistics (recipe_id, view_count) 
       VALUES (?, 1)
       ON DUPLICATE KEY UPDATE view_count = view_count + 1, last_viewed = CURRENT_TIMESTAMP`,
            [recipeId]
        );
    }

    static async incrementFavoriteCount(recipeId) {
        await db.execute(
            `UPDATE recipe_statistics 
       SET favorite_count = favorite_count + 1 
       WHERE recipe_id = ?`,
            [recipeId]
        );
    }

    static async decrementFavoriteCount(recipeId) {
        await db.execute(
            `UPDATE recipe_statistics 
       SET favorite_count = favorite_count - 1 
       WHERE recipe_id = ?`,
            [recipeId]
        );
    }

    static async getStatistics(recipeId) {
        const [rows] = await db.execute(
            'SELECT * FROM recipe_statistics WHERE recipe_id = ?',
            [recipeId]
        );
        return rows[0] || {view_count: 0, favorite_count: 0};
    }

    static async getPopularRecipes(limit = 10) {
        const [rows] = await db.execute(
            `SELECT r.*, rs.view_count, rs.favorite_count
       FROM recipes r
       JOIN recipe_statistics rs ON r.id = rs.recipe_id
       ORDER BY rs.favorite_count DESC
       LIMIT ?`,
            [limit]
        );
        return rows;
    }
}

module.exports = RecipeStatistic;