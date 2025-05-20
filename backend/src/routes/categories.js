const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const auth = require('../middlewares/auth');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Public routes
router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryById);
router.get('/:id/recipes', categoriesController.getRecipesByCategory);

// Protected routes (require authentication)
router.post('/', auth, upload.single('image'), categoriesController.createCategory);
router.put('/:id', auth, upload.single('image'), categoriesController.updateCategory);
router.delete('/:id', auth, categoriesController.deleteCategory);

module.exports = router;