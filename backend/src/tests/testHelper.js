const { app, server } = require('../app');
const db = require('../config/db');

global.cleanup = async () => {
    await db.end();

    if (server) {
        await new Promise(resolve => server.close(resolve));
    }
    const cron = require('node-cron');
    const tasks = cron.getTasks();
    tasks.forEach(task => task.stop());
};

module.exports = {
    app,
    db,
    server
};