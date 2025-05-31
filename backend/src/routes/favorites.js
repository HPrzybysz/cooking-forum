const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');
const auth = require('../middlewares/auth');

//protected
router.post('/recipes/:recipeId/favorite', auth, favoritesController.addFavorite);
router.delete('/recipes/:recipeId/favorite', auth, favoritesController.removeFavorite);
router.get('/recipes/:recipeId/favorite', auth, favoritesController.checkFavorite);
router.get('/user/favorites', auth, favoritesController.getUserFavorites);
router.post('/sync-favorite-counts', auth, favoritesController.syncFavoriteCounts);

module.exports = router;