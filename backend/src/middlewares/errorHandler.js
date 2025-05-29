const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'Invalid token'});
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message});
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({error: 'Duplicate entry'});
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({error: 'File size too large'});
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
}

module.exports = errorHandler;