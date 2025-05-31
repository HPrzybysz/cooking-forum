const express = require('express');
const router = express.Router();
const componentsController = require('../controllers/recipeComponents');
const auth = require('../middlewares/auth');

// Protected routes
router.post('/recipes/:recipeId/components', auth, componentsController.addRecipeComponents);
router.delete('/recipes/:recipeId/components', auth, componentsController.deleteAllRecipeComponents);

module.exports = router;