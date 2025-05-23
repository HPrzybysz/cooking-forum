const RecipeRating = require('../models/RecipeRating');

exports.submitRating = async (req, res) => {
    try {
        const { rating, review } = req.body;
        await RecipeRating.createOrUpdate({
            userId: req.userId,
            recipeId: req.params.recipeId,
            rating,
            review
        });
        res.json({ message: 'Rating submitted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRecipeRatings = async (req, res) => {
    try {
        const ratings = await RecipeRating.getByRecipeId(req.params.recipeId);
        const average = await RecipeRating.getAverageRating(req.params.recipeId);
        res.json({ ratings, average });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserRating = async (req, res) => {
    try {
        const rating = await RecipeRating.getUserRating(req.userId, req.params.recipeId);
        res.json(rating || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRating = async (req, res) => {
    try {
        const deleted = await RecipeRating.delete(req.userId, req.params.recipeId);
        if (!deleted) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        res.json({ message: 'Rating deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};