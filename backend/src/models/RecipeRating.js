const db = require('../config/db');

class RecipeRating {
    static async createOrUpdate({userId, recipeId, rating, review = null}) {
        const [result] = await db.execute(
            `INSERT INTO recipe_ratings (user_id, recipe_id, rating, review) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             rating = VALUES(rating), 
             review = VALUES(review)`,
            [userId, recipeId, rating, review]
        );
        return result;
    }

    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            `SELECT r.*, u.first_name, u.last_name 
             FROM recipe_ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.recipe_id = ?`,
            [recipeId]
        );
        return rows;
    }

    static async getAverageRating(recipeId) {
        const [rows] = await db.execute(
            'SELECT AVG(rating) as average, COUNT(*) as count FROM recipe_ratings WHERE recipe_id = ?',
            [recipeId]
        );
        return {
            average: parseFloat(rows[0].average) || 0,
            count: rows[0].count
        };
    }

    static async getUserRating(userId, recipeId) {
        const [rows] = await db.execute(
            'SELECT * FROM recipe_ratings WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );
        return rows[0];
    }

    static async delete(userId, recipeId) {
        const [result] = await db.execute(
            'DELETE FROM recipe_ratings WHERE user_id = ? AND recipe_id = ?',
            [userId, recipeId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = RecipeRating;