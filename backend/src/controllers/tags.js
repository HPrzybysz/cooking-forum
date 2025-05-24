const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.getAll();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecipeTags = async (req, res) => {
    try {
        const tags = await Tag.getByRecipeId(req.params.recipeId);
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addTagToRecipe = async (req, res) => {
    try {
        const { name } = req.body;
        const tagId = await Tag.findOrCreate(name);
        await Tag.addToRecipe(req.params.recipeId, tagId);
        res.status(201).json({ message: 'Tag added to recipe' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removeTagFromRecipe = async (req, res) => {
    try {
        await Tag.removeFromRecipe(req.params.recipeId, req.params.tagId);
        res.json({ message: 'Tag removed from recipe' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};