const db = require('../config/db');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.getProfile(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        let avatarData = null;

        if (req.file) {
            avatarData = req.file.buffer;
        }

        await User.updateProfile(req.userId, { firstName, lastName, email, avatarData });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};