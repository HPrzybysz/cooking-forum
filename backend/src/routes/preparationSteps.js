const express = require('express');
const router = express.Router();
const stepsController = require('../controllers/preparationSteps');
const auth = require('../middlewares/auth');

// public
router.get('/recipes/:recipeId/steps', stepsController.getSteps);

// protected
router.post('/recipes/:recipeId/steps', auth, stepsController.createStep);
router.put('/steps/:id', auth, stepsController.updateStep);
router.delete('/steps/:id', auth, stepsController.deleteStep);
router.put('/recipes/:recipeId/steps/reorder', auth, stepsController.reorderSteps);

module.exports = router;