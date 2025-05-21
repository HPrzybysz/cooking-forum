const db = require('../config/db');

class PreparationStep {
    static async getByRecipeId(recipeId) {
        const [rows] = await db.execute(
            'SELECT * FROM preparation_steps WHERE recipe_id = ? ORDER BY step_number',
            [recipeId]
        );
        return rows;
    }

    static async create(recipeId, stepNumber, instruction) {
        const [result] = await db.execute(
            'INSERT INTO preparation_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
            [recipeId, stepNumber, instruction]
        );
        return result.insertId;
    }

    static async update(id, instruction) {
        const [result] = await db.execute(
            'UPDATE preparation_steps SET instruction = ? WHERE id = ?',
            [instruction, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM preparation_steps WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async reorderSteps(recipeId, steps) {
        await db.query('START TRANSACTION');
        try {
            await db.execute('DELETE FROM preparation_steps WHERE recipe_id = ?', [recipeId]);

            for (const step of steps) {
                await db.execute(
                    'INSERT INTO preparation_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
                    [recipeId, step.step_number, step.instruction]
                );
            }

            await db.query('COMMIT');
            return true;
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = PreparationStep;