const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?',
            [req.userId]
        );

        if (!rows.length) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {firstName, lastName, email} = req.body;
        let avatarData = null;

        if (req.file) {
            avatarData = req.file.buffer; // Binary image data
        }

        await User.updateProfile(req.userId, {firstName, lastName, email, avatarData});

        res.json({message: 'Profile updated successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};