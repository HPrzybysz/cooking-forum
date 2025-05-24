const PreparationStep = require('../models/PreparationStep');

exports.getSteps = async (req, res) => {
    try {
        const steps = await PreparationStep.getByRecipeId(req.params.recipeId);
        res.json(steps);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createStep = async (req, res) => {
    try {
        const {step_number, instruction} = req.body;
        const stepId = await PreparationStep.create(
            req.params.recipeId,
            step_number,
            instruction
        );
        res.status(201).json({id: stepId, step_number, instruction});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.updateStep = async (req, res) => {
    try {
        const {instruction} = req.body;
        const updated = await PreparationStep.update(req.params.id, instruction);

        if (!updated) {
            return res.status(404).json({error: 'Step not found'});
        }

        res.json({message: 'Step updated successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.deleteStep = async (req, res) => {
    try {
        const deleted = await PreparationStep.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({error: 'Step not found'});
        }

        res.json({message: 'Step deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.reorderSteps = async (req, res) => {
    try {
        await PreparationStep.reorderSteps(req.params.recipeId, req.body.steps);
        res.json({message: 'Steps reordered successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};