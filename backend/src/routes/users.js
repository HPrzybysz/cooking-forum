const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const usersController = require('../controllers/users');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

router.get('/me', auth, usersController.getProfile);
router.patch('/me', auth, usersController.updateProfile);
router.patch('/me/avatar', auth, upload.single('avatar'), usersController.updateAvatar);
router.get('/me/recipes', auth, usersController.getUserRecipes);

module.exports = router;