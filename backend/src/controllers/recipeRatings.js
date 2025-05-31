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

        let average = 0;
        if (ratings.length > 0) {
            const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
            average = sum / ratings.length;
        }

        res.json({
            ratings,
            average: parseFloat(average.toFixed(2)),
            count: ratings.length
        });
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