const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const ingredientsController = require('../controllers/ingredients');
const auth = require('../middlewares/auth');

// Public
router.get('/', recipesController.getAllRecipes);
router.get('/:id', recipesController.getRecipe);

// Protected
router.post('/', auth, recipesController.createRecipe);
router.put('/:id', auth, recipesController.updateRecipe);
router.delete('/:id', auth, recipesController.deleteRecipe);
router.get('/user/me', auth, recipesController.getUserRecipes);

router.get('/:recipeId/ingredients', ingredientsController.getIngredients);
router.post('/:recipeId/ingredients', auth, ingredientsController.createIngredient);
router.delete('/:recipeId/ingredients', auth, ingredientsController.deleteAllIngredients);

module.exports = router;