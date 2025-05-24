const Ingredient = require('../models/Ingredient');

exports.getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.getByRecipeId(req.params.recipeId);
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createIngredient = async (req, res) => {
    try {
        const {name, amount} = req.body;
        const ingredientId = await Ingredient.create(req.params.recipeId, {name, amount});
        res.status(201).json({id: ingredientId, name, amount});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.updateIngredient = async (req, res) => {
    try {
        const {name, amount} = req.body;
        const updated = await Ingredient.update(req.params.id, {name, amount});

        if (!updated) {
            return res.status(404).json({error: 'Ingredient not found'});
        }

        res.json({message: 'Ingredient updated successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.deleteIngredient = async (req, res) => {
    try {
        const deleted = await Ingredient.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({error: 'Ingredient not found'});
        }

        res.json({message: 'Ingredient deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteAllIngredients = async (req, res) => {
    try {
        await Ingredient.deleteAllForRecipe(req.params.recipeId);
        res.json({message: 'All ingredients deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};