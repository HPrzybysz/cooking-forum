const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require("../middlewares/auth");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/change-password', auth, authController.changePassword); // Requires current password
router.post('/reset-password', authController.resetPassword); // Uses token
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;