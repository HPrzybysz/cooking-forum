const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require("../middlewares/auth");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', auth, authController.logout);

module.exports = router;