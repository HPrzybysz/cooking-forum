const express = require('express');
const router = express.Router();
const recipeRatingsController = require('../controllers/recipeRatings');
const auth = require('../middlewares/auth');

//public
router.get('/recipes/:recipeId/ratings', recipeRatingsController.getRecipeRatings);

//protected
router.post('/recipes/:recipeId/ratings', auth, recipeRatingsController.submitRating);
router.get('/recipes/:recipeId/ratings/me', auth, recipeRatingsController.getUserRating);
router.delete('/recipes/:recipeId/ratings', auth, recipeRatingsController.deleteRating);

module.exports = router;