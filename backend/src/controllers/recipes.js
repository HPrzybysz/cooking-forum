const Recipe = require('../models/Recipe');
const {generateToken} = require('../utils/encryption');

exports.createRecipe = async (req, res) => {
    try {
        const {title, description, prepTime, servings, equipment, authorNote, categoryId} = req.body;
        const recipeId = await Recipe.create({
            userId: req.userId,
            title,
            description,
            prepTime,
            servings,
            equipment,
            authorNote,
            categoryId
        });

        res.status(201).json({
            message: 'Recipe created successfully',
            recipeId
        });
    } catch (error) {
        res.status(400).json({error: error.message});
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