const express = require('express');
const router = express.Router();
const recipeImagesController = require('../controllers/recipeImages');
const auth = require('../middlewares/auth');
const multer = require("multer");


const upload = multer({ storage: multer.memoryStorage() }).array('images');

//public
router.get('/recipes/:recipeId/images', recipeImagesController.getRecipeImages);

//protected
router.post('/recipes/:recipeId/images', auth, recipeImagesController.uploadImage);
router.put('/recipes/:recipeId/images/:imageId/primary', auth, recipeImagesController.setPrimaryImage);
router.delete('/images/:imageId', auth, recipeImagesController.deleteImage);

router.post('/recipes/:recipeId/images', auth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        await recipeImagesController.uploadImages(req, res);
    });
});

module.exports = router;