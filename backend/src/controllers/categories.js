const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const imageData = req.file ? req.file.buffer : null;

        const categoryId = await Category.create({ name, imageData });
        res.status(201).json({ id: categoryId, name });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const imageData = req.file ? req.file.buffer : null;

        await Category.update(req.params.id, { name, imageData });
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecipesByCategory = async (req, res) => {
    try {
        const recipes = await Category.getRecipesByCategory(req.params.id);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};