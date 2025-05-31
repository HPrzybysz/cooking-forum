const Recipe = require('../../models/Recipe');
const db = require('../../config/db');

describe('Recipe Model', () => {
    let testRecipeId;

    const testRecipe = {
        userId: 1,
        title: 'Model Test Recipe',
        description: 'Test Description',
        prepTime: 30,
        servings: 4
    };

    beforeAll(async () => {
        await db.execute('DELETE FROM recipes WHERE title = ?', [testRecipe.title]);
    });

    afterAll(async () => {
        await db.execute('DELETE FROM recipes WHERE title = ?', [testRecipe.title]);
    });

    describe('create()', () => {
        it('should create a new recipe', async () => {
            testRecipeId = await Recipe.create(testRecipe);
            expect(testRecipeId).toBeDefined();
            expect(typeof testRecipeId).toBe('number');
        });
    });

    describe('getById()', () => {
        it('should retrieve a recipe by ID', async () => {
            const recipe = await Recipe.getById(testRecipeId);
            expect(recipe).toBeDefined();
            expect(recipe.title).toEqual(testRecipe.title);
        });

        it('should return undefined for non-existent recipe', async () => {
            const recipe = await Recipe.getById(999999);
            expect(recipe).toBeUndefined();
        });
    });

    describe('update()', () => {
        it('should update recipe details', async () => {
            const updates = {
                title: 'Updated Title',
                description: 'Updated Description'
            };

            const result = await Recipe.update(testRecipeId, updates);
            expect(result).toBe(true);

            const updatedRecipe = await Recipe.getById(testRecipeId);
            expect(updatedRecipe.title).toEqual(updates.title);
        });
    });
});