const RecipeImage = require('../models/RecipeImage');
const db = require('../config/db');

exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        const recipe_id = req.params.recipeId;
        const isPrimary = req.body.isPrimary === 'true';

        await db.query('START TRANSACTION');

        const results = [];
        for (const [index, file] of req.files.entries()) {
            const imageId = await RecipeImage.create({
                recipe_id,
                image_data: file.buffer,
                is_primary: index === 0 && isPrimary
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
        res.status(500).json({ error: error.message });
    }
};

exports.setPrimaryImage = async (req, res) => {
    try {
        await RecipeImage.setPrimaryImage(req.params.recipeId, req.params.imageId);
        res.json({ message: 'Primary image updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const deleted = await RecipeImage.delete(req.params.imageId);
        if (!deleted) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.preUploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        res.status(200).json({
            success: true,
            files: req.files.map(file => ({
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype
            }))
        });
    } catch (error) {
        console.error('Error validating images:', error);
        res.status(500).json({ error: 'Failed to validate images' });
    }
};

exports.finalizeImageUpload = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }

        await db.query('START TRANSACTION');

        const results = [];
        for (const [index, file] of files.entries()) {
            const imageId = await RecipeImage.create({
                recipe_id: recipeId,
                image_data: file.buffer,
                is_primary: index === 0
            });
            results.push({ id: imageId });
        }

        await db.query('COMMIT');
        res.status(201).json({
            success: true,
            images: results
        });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error finalizing image upload:', error);
        res.status(500).json({ error: 'Failed to finalize image upload' });
    }
};