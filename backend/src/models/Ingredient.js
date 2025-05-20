const db = require('../config/db');

class Ingredient {
    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            'SELECT id, name, amount FROM ingredients WHERE recipe_id = ? ORDER BY id',
            [recipeId]
        );
        return rows;
    }

    static async create(recipeId, {name, amount}) {
        const [result] = await db.execute(
            'INSERT INTO ingredients (recipe_id, name, amount) VALUES (?, ?, ?)',
            [recipeId, name, amount]
        );
        return result.insertId;
    }

    static async update(id, {name, amount}) {
        const [result] = await db.execute(
            'UPDATE ingredients SET name = ?, amount = ? WHERE id = ?',
            [name, amount, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM ingredients WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async deleteAllForRecipe(recipeId) {
        const [result] = await db.execute(
            'DELETE FROM ingredients WHERE recipe_id = ?',
            [recipeId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Ingredient;