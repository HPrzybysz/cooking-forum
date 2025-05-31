module.exports = async () => {
    if (global.cleanup) {
        await global.cleanup();
    }

    if (typeof jest !== 'undefined') {
        setTimeout(() => process.exit(0), 1000);
    }
};