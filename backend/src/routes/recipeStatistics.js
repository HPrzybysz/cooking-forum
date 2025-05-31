const express = require('express');
const router = express.Router();
const statsController = require('../controllers/recipeStatistics');

// public
router.get('/recipes/:recipeId/stats', statsController.getRecipeStatistics);
router.get('/recipes/popular', statsController.getPopularRecipes);


module.exports = router;