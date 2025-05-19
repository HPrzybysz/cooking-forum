const { Recipe, Image } = require('../models');
const fs = require('fs');

exports.createRecipe = async (req, res, next) => {
    try {
        const { title, description, prepTime, servings, categoryId, ingredients, steps, tags } = req.body;

        const recipe = await Recipe.create({
            title,
            description,
            prepTime,
            servings,
            categoryId,
            userId: req.user.id
        });

        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            await Promise.all(images.map(async (image, index) => {
                const imageData = fs.readFileSync(image.tempFilePath);
                await Image.create({
                    imageData,
                    mimeType: image.mimetype,
                    isPrimary: index === 0,
                    recipeId: recipe.id
                });
                fs.unlinkSync(image.tempFilePath); // Remove temp file
            }));
        }

        // Add ingredients, steps, tags here...

        res.status(201).json(recipe);
    } catch (error) {
        next(error);
    }
};

exports.getRecipeImage = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', image.mimeType);
        res.send(image.imageData);
    } catch (error) {
        next(error);
    }
};