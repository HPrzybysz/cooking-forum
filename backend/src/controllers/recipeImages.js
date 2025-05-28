const RecipeImage = require('../models/RecipeImage');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()}).single('image');

exports.uploadImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }

            const imageId = await RecipeImage.create({
                recipeId: req.params.recipeId,
                imageData: req.file.buffer,
                isPrimary: req.body.isPrimary === 'true'
            });

            res.status(201).json({
                id: imageId,
                message: 'Image uploaded successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

exports.getRecipeImages = async (req, res) => {
    try {
        const images = await RecipeImage.getByRecipeId(req.params.recipeId);
        res.json(images);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.setPrimaryImage = async (req, res) => {
    try {
        await RecipeImage.setPrimaryImage(req.params.recipeId, req.params.imageId);
        res.json({message: 'Image updated'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const deleted = await RecipeImage.delete(req.params.imageId);
        if (!deleted) {
            return res.status(404).json({error: 'Image not found'});
        }
        res.json({message: 'Image deleted'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        const isPrimary = req.body.isPrimary === 'true';
        const recipeId = req.params.recipeId;

        await db.execute('DELETE FROM recipe_images WHERE recipe_id = ?', [recipeId]);

        const results = [];
        for (const [index, file] of req.files.entries()) {
            const imageId = await RecipeImage.create({
                recipeId,
                imageData: file.buffer,
                isPrimary: index === 0 && isPrimary
            });
            results.push({ id: imageId });
        }

        res.status(201).json({
            message: 'Images uploaded successfully',
            images: results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};