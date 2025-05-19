const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware'); // Make sure to destructure
const fileUpload = require('express-fileupload');

router.use(protect);

router.post(
    '/',
    fileUpload({
        createParentPath: true,
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true
    }),
    recipeController.createRecipe
);

router.get('/:recipeId/images/:imageId', recipeController.getRecipeImage);

router.get('/', (req, res) => {
    res.send('Recipes route working');
});

module.exports = router;