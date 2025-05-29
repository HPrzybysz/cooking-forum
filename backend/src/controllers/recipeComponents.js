const db = require('../config/db');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const PreparationStep = require('../models/PreparationStep');
const Tag = require('../models/Tag');

exports.addRecipeComponents = async (req, res) => {
    try {
        const {recipeId} = req.params;
        const {ingredients, steps, tags} = req.body;

        const recipe = await Recipe.getById(recipeId);
        if (!recipe) {
            return res.status(404).json({error: 'Recipe not found'});
        }

        await db.query('START TRANSACTION');

        if (ingredients && ingredients.length > 0) {
            await Ingredient.deleteAllForRecipe(recipeId);
            for (const ing of ingredients) {
                await Ingredient.create(recipeId, ing);
            }
        }

        if (steps && steps.length > 0) {
            await PreparationStep.deleteAllForRecipe(recipeId);
            for (const step of steps) {
                await PreparationStep.create(recipeId, step.step_number, step.instruction);
            }
        }

        if (tags && tags.length > 0) {
            await db.execute('DELETE FROM recipe_tags WHERE recipe_id = ?', [recipeId]);
            for (const tagName of tags) {
                const tagId = await Tag.findOrCreate(tagName);
                await Tag.addToRecipe(recipeId, tagId);
            }
        }

        await db.query('COMMIT');
        res.json({message: 'Recipe components added successfully'});
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error adding recipe components:', error);
        res.status(400).json({error: error.message});
    }
};

exports.deleteAllRecipeComponents = async (req, res) => {
    try {
        const {recipeId} = req.params;

        await db.query('START TRANSACTION');
        await Ingredient.deleteAllForRecipe(recipeId);
        await PreparationStep.deleteAllForRecipe(recipeId);
        await db.execute('DELETE FROM recipe_tags WHERE recipe_id = ?', [recipeId]);
        await db.query('COMMIT');

        res.json({message: 'All recipe components deleted successfully'});
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error deleting recipe components:', error);
        res.status(500).json({error: error.message});
    }
};