const RecipeImage = require('../models/RecipeImage');
const db = require('../config/db');

exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        const recipeId = req.params.recipeId;
        const isPrimary = req.body.isPrimary === 'true';

        await db.query('START TRANSACTION');

        const results = [];
        for (const [index, file] of req.files.entries()) {
            const imageId = await RecipeImage.create({
                recipeId,
                imageData: file.buffer,
                isPrimary: index === 0 && isPrimary
            });
            results.push({ id: imageId });
        }

        await db.query('COMMIT');
        res.status(201).json({
            message: 'Images uploaded successfully',
            images: results
        });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error uploading images:', error);
        res.status(500).json({ error: error.message });
    }
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