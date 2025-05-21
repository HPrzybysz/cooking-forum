const express = require('express');
const router = express.Router();
const statsController = require('../controllers/recipeStatistics');

// public
router.get('/recipes/:recipeId/stats', statsController.getRecipeStatistics);
router.get('/recipes/popular', statsController.getPopularRecipes);


// protected
router.post('/recipes/:recipeId/view', statsController.trackView);

module.exports = router;