const RecipeStatistic = require('../models/RecipeStatistic');

exports.getRecipeStatistics = async (req, res) => {
    try {
        const stats = await RecipeStatistic.getStatistics(req.params.recipeId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getPopularRecipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const recipes = await RecipeStatistic.getPopularRecipes(limit);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};