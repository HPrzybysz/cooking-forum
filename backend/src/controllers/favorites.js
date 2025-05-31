const Favorite = require('../models/Favorite');
const RecipeStatistic = require('../models/RecipeStatistic');

exports.addFavorite = async (req, res) => {
    try {
        await Favorite.addFavorite(req.userId, req.params.recipeId);
        res.json({message: 'Recipe added to favorites'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        await Favorite.removeFavorite(req.userId, req.params.recipeId);
        res.json({message: 'Recipe removed from favorites'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.syncFavoriteCounts = async (req, res) => {
    try {
        await Favorite.syncFavoriteCounts();
        res.json({message: 'Favorite counts synchronized successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.getUserFavorites(req.userId);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const isFavorite = await Favorite.isFavorite(req.userId, req.params.recipeId);
        res.json({isFavorite});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};