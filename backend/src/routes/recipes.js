const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const auth = require('../middlewares/auth');

// Public
router.get('/', recipesController.getAllRecipes);
router.get('/:id', recipesController.getRecipe);

// Protected
router.post('/', auth, recipesController.createRecipe);
router.post('/:recipeId/components', auth, recipesController.addRecipeComponents); // Add this line
router.put('/:id', auth, recipesController.updateRecipe);
router.delete('/:id', auth, recipesController.deleteRecipe);
router.get('/user/me', auth, recipesController.getUserRecipes);

module.exports = router;