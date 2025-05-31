const db = require('../config/db');
const Favorite = require('../models/Favorite');

(async () => {
    try {
        console.log('Initializing recipe statistics...');
        await Favorite.syncFavoriteCounts();
        console.log('Recipe statistics initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing recipe statistics:', error);
        process.exit(1);
    }
})();