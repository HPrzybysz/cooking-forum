require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const sequelize = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
// app.use('/api/users', userRoutes);

// app.use(errorHandler);

sequelize.sync({ alter: true })
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = app;