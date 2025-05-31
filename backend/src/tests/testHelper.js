const app = require('../app');
const db = require('../config/db');
const { cleanup } = require('./setup');

module.exports = {
    app,
    db,
    cleanup
};