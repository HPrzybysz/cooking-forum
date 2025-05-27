require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const ingredientRoutes = require('./routes/ingredients');
const recipeRoutes = require('./routes/recipes');
const statsRoutes = require('./routes/recipeStatistics');
const stepsRoutes = require('./routes/preparationSteps');
const tagRoutes = require('./routes/tags');
const recipeImagesRoutes = require('./routes/recipeImages');
const recipeRatingsRoutes = require('./routes/recipeRatings');
const favoritesRoutes = require('./routes/favorites');

const app = express();

// CORS config
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', statsRoutes);
app.use('/api', stepsRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api', recipeImagesRoutes);
app.use('/api', recipeRatingsRoutes);
app.use('/api', favoritesRoutes);
app.use('/uploads', express.static('uploads'));


const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server probably running on port ${PORT}`);
});