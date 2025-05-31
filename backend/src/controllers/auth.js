const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const PasswordResetToken = require('../models/PasswordResetToken');
const {generateToken} = require('../utils/encryption');
const {sendPasswordResetEmail} = require('../utils/email');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        if (!email || !password) {
            logger.warn('Registration attempt with missing fields');
            return res.status(400).json({error: 'Email and password are required'});
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            logger.warn(`Duplicate registration attempt for ${email}`);
            return res.status(409).json({error: 'Email already exists'});
        }

        const userId = await User.create({firstName, lastName, email, password});
        logger.info(`New user registered: ${email}`);

        const token = generateToken({id: userId});
        const refreshToken = await RefreshToken.create(
            userId,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        );

        res.status(201).json({
            user: {id: userId, firstName, lastName, email},
            token,
            refreshToken
        });
    } catch (error) {
        logger.error('Registration failed', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({error: 'Registration failed'});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findByEmail(email);
        if (!user || !(await User.verifyPassword(user, password))) {
            logger.warn(`Failed login attempt for ${email}`);
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = generateToken({id: user.id});
        const refreshToken = await RefreshToken.create(
            user.id,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        );

        logger.info(`User logged in: ${email}`);
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatarUrl: user.avatar_url
            },
            token
        });
    } catch (error) {
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(401).json({error: 'Invalid credentials'});
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).json({error: 'Refresh token is required'});
        }

        const storedToken = await RefreshToken.findByToken(refreshToken);
        if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
            logger.warn('Invalid refresh token attempt');
            return res.status(401).json({error: 'Invalid or expired refresh token'});
        }

        const user = await User.getProfile(storedToken.user_id);
        if (!user) {
            logger.error('User not found for refresh token');
            return res.status(404).json({error: 'User not found'});
        }

        const newToken = generateToken({id: user.id});
        const newRefreshToken = await RefreshToken.create(
            user.id,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        );

        await RefreshToken.delete(refreshToken);

        logger.info(`Token refreshed for user ${user.email}`);
        res.json({
            user,
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        logger.error('Token refresh failed', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({error: 'Token refresh failed'});
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;

        if (!email) {
            logger.warn('Password reset requested without email');
            return res.status(400).json({error: 'Email is required'});
        }

        const user = await User.findByEmail(email);
        if (!user) {
            logger.info(`Password reset requested for non-existent email: ${email}`);
            return res.json({message: 'If the email exists, a reset link has been sent'});
        }

        const token = await PasswordResetToken.create(
            user.id,
            new Date(Date.now() + 3600000) // 1 hour
        );

        const emailSent = await sendPasswordResetEmail(email, token);

        if (!emailSent) {
            logger.error('Failed to send password reset email', {email});
            throw new Error('Failed to send password reset email');
        }

        logger.info(`Password reset email sent to ${email}`);
        res.json({message: 'If the email exists, a reset link has been sent'});
    } catch (error) {
        logger.error('Password reset request failed', {
            error: error.message,
            stack: error.stack,
            email: req.body?.email
        });
        res.status(500).json({error: 'Error processing password reset request'});
    }
};
// uses old passwrod
exports.changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({error: 'Both current and new password are required'});
        }

        if (newPassword.length < 8) {
            return res.status(400).json({error: 'New password must be at least 8 characters'});
        }

        // Get full user with password hash
        const user = await User.getProfile(req.userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Verify current password
        const isPasswordValid = await User.verifyPassword(user, currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Current password is incorrect'});
        }

        // Update password
        await User.updatePassword(req.userId, newPassword);

        logger.info(`Password changed for user ${req.userId}`);
        return res.json({message: 'Password changed successfully'});

    } catch (error) {
        logger.error('Password change failed', {
            error: error.message,
            stack: error.stack,
            userId: req.userId
        });

        if (error.message.includes('Invalid arguments')) {
            return res.status(400).json({error: 'Invalid password data'});
        }
        return res.status(500).json({error: 'Failed to change password'});
    }
};

// Password reset (uses token)
exports.resetPassword = async (req, res) => {
    try {
        const {token, newPassword} = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({error: 'Token and new password are required'});
        }

        if (newPassword.length < 8) {
            return res.status(400).json({error: 'Password must be at least 8 characters'});
        }

        const resetToken = await PasswordResetToken.findByToken(token);
        if (!resetToken) {
            return res.status(400).json({error: 'Invalid or expired token'});
        }

        await User.updatePassword(resetToken.user_id, newPassword);
        await PasswordResetToken.markAsUsed(token);
        return res.json({message: 'Password reset successfully'});
    } catch (error) {
        logger.error('Password reset failed', error);
        res.status(500).json({error: 'Error resetting password'});
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            await RefreshToken.deleteAllForUser(req.userId);
            logger.info(`User logged out: ${req.userId}`);
        }
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.json({message: 'Logged out successfully'});
    } catch (error) {
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(500).json({error: 'Logout failed'});
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.getProfile(req.userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json({user});
    } catch (error) {
        res.status(500).json({error: 'Error fetching user'});
    }
};