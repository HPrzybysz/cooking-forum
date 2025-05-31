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

    static async getStatistics(recipeId) {
        const [stats] = await db.execute(
            'SELECT * FROM recipe_statistics WHERE recipe_id = ?',
            [recipeId]
        );

        return {
            view_count: stats[0]?.view_count || 0,
            favorite_count: stats[0]?.favorite_count || 0,
            last_viewed: stats[0]?.last_viewed || null
        };
    }

    static async getPopularRecipes(limit = 10) {
        const [rows] = await db.execute(
            `SELECT r.*, rs.favorite_count
             FROM recipes r
             LEFT JOIN recipe_statistics rs ON r.id = rs.recipe_id
             ORDER BY rs.favorite_count DESC, rs.view_count DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }

    static async ensureStatisticsExist(recipeId) {
        await db.execute(
            `INSERT INTO recipe_statistics (recipe_id, view_count, favorite_count)
             VALUES (?, 0, 0)
             ON DUPLICATE KEY UPDATE recipe_id = recipe_id`,
            [recipeId]
        );
    }
}

module.exports = RecipeStatistic;