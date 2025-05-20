const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredients');
const auth = require('../middlewares/auth');

router.get('/recipes/:recipeId/ingredients', ingredientsController.getIngredients);

router.post('/recipes/:recipeId/ingredients', auth, ingredientsController.createIngredient);

router.put('/ingredients/:id', auth, ingredientsController.updateIngredient);

router.delete('/ingredients/:id', auth, ingredientsController.deleteIngredient);

router.delete('/recipes/:recipeId/ingredients', auth, ingredientsController.deleteAllIngredients);

module.exports = router;