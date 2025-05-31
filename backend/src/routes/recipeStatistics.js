const express = require('express');
const router = express.Router();
const statsController = require('../controllers/recipeStatistics');

// public
router.get('/popular', statsController.getPopularRecipes);
router.get('/:recipeId/stats', statsController.getRecipeStatistics);


module.exports = router;