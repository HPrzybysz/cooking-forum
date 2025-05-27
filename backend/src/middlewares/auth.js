const { verifyToken } = require('../utils/encryption');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Authentication required');
        }

        const decoded = verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (error) {
        logger.error('Authentication failed', {
            error: error.message,
            stack: error.stack
        });
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = auth;