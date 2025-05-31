const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const PreparationStep = require('../models/PreparationStep');
const Tag = require('../models/Tag');
const RecipeImage = require('../models/RecipeImage');
const {generateToken} = require('../utils/encryption');
const db = require('../config/db');

exports.createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            prep_time,
            servings,
            equipment,
            author_note,
            category_id,
            user_id
        } = req.body;

        if (!title || !description || prep_time === undefined || servings === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const recipeId = await Recipe.create({
            userId: user_id || req.userId,
            title,
            description,
            prepTime: prep_time,
            servings,
            equipment: equipment || null,
            authorNote: author_note || null,
            categoryId: category_id || null
        });

        res.status(201).json({
            message: 'Recipe created successfully',
            recipeId
        });
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.addRecipeComponents = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.getById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (req.body.ingredients) {
            await Ingredient.deleteAllForRecipe(recipeId);
            for (const ing of req.body.ingredients) {
                await Ingredient.create(recipeId, ing);
            }
        }

        if (req.body.steps) {
            await db.execute('DELETE FROM preparation_steps WHERE recipe_id = ?', [recipeId]);
            for (const [index, step] of req.body.steps.entries()) {
                await PreparationStep.create(recipeId, index + 1, step.instruction);
            }
        }

        if (req.body.tags) {
            await db.execute('DELETE FROM recipe_tags WHERE recipe_id = ?', [recipeId]);
            for (const tagName of req.body.tags) {
                const tagId = await Tag.findOrCreate(tagName);
                await Tag.addToRecipe(recipeId, tagId);
            }
        }

        res.json({ message: 'Recipe components added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.getById(req.params.id);
        if (!recipe) {
            return res.status(404).json({error: 'Recipe not found'});
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const {title, description, prepTime, servings, equipment, authorNote, categoryId} = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (prepTime !== undefined) updateData.prepTime = prepTime;
        if (servings !== undefined) updateData.servings = servings;
        if (equipment !== undefined) updateData.equipment = equipment;
        if (authorNote !== undefined) updateData.authorNote = authorNote;
        if (categoryId !== undefined) updateData.categoryId = categoryId;

        const updated = await Recipe.update(req.params.id, updateData);

        if (!updated) {
            return res.status(404).json({error: 'Recipe not found'});
        }

        res.json({message: 'Recipe updated successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const deleted = await Recipe.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({error: 'Recipe not found'});
        }
        res.json({message: 'Recipe deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.getByUserId(req.userId);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.getAll();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};