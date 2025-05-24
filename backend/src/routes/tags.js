const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
const auth = require('../middlewares/auth');

// public
router.get('/', tagsController.getTags);
router.get('/recipes/:recipeId', tagsController.getRecipeTags);

// protected
router.post('/recipes/:recipeId', auth, tagsController.addTagToRecipe);
router.delete('/recipes/:recipeId/:tagId', auth, tagsController.removeTagFromRecipe);

module.exports = router;