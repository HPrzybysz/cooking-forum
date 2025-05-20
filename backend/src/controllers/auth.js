const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({error: 'Email already in use'});
        }

        const userId = await User.create({firstName, lastName, email, password});
        const token = await User.generateAuthToken(userId);

        res.status(201).json({
            user: {id: userId, firstName, lastName, email},
            token
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const isMatch = await User.verifyPassword(user, password);
        if (!isMatch) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = await User.generateAuthToken(user.id);

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
        res.status(400).json({error: error.message});
    }
};