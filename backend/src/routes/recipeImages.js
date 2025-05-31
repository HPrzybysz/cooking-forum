const express = require('express');
const router = express.Router();
const recipeImagesController = require('../controllers/recipeImages');
const auth = require('../middlewares/auth');
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
        files: 5 // Max 5 files
    }
}).array('images');

//public
router.get('/recipes/:recipeId/images', recipeImagesController.getRecipeImages);

//protected
router.post('/recipes/:recipeId/images', auth, upload, recipeImagesController.uploadImages);
router.put('/recipes/:recipeId/images/:imageId/primary', auth, recipeImagesController.setPrimaryImage);
router.delete('/images/:imageId', auth, recipeImagesController.deleteImage);
router.post('/recipes/images/pre-upload', auth, upload, recipeImagesController.preUploadImages);
router.post('/recipes/:recipeId/images/finalize', auth, recipeImagesController.finalizeImageUpload);

module.exports = router;