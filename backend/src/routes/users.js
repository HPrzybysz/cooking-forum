const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const usersController = require('../controllers/users');

const upload = multer({
    storage: multer.memoryStorage(), // Store in memory for DB storage
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/me', auth, usersController.getProfile);
router.put('/me', auth, upload.single('avatar'), usersController.updateProfile);

module.exports = router;