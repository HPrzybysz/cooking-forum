const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');

describe('Recipe Controller', () => {
    let testUser;
    let authToken;
    let testRecipe;

    beforeAll(async () => {
        testUser = {
            firstName: 'Recipe',
            lastName: 'Tester',
            email: 'recipe@test.com',
            password: 'password123'
        };

        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
        const userId = await User.create(testUser);

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        authToken = loginRes.body.token;
    });

    beforeEach(async () => {
        testRecipe = {
            title: 'Test Recipe',
            description: 'Test Description',
            prep_time: 30,
            servings: 4,
            user_id: testUser.id
        };

        await db.execute('DELETE FROM recipes WHERE title = ?', [testRecipe.title]);
    });

    afterAll(async () => {
        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
        await db.execute('DELETE FROM recipes WHERE title = ?', [testRecipe.title]);
    });

    describe('POST /api/recipes', () => {
        it('should create a new recipe', async () => {
            const res = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testRecipe);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('recipeId');
        });

        it('should reject missing required fields', async () => {
            const invalidRecipe = {...testRecipe};
            delete invalidRecipe.title;

            const res = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidRecipe);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toContain('Missing required fields');
        });
    });

    describe('GET /api/recipes/:id', () => {
        it('should get a recipe by ID', async () => {
            const recipeId = await Recipe.create(testRecipe);

            const res = await request(app)
                .get(`/api/recipes/${recipeId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toEqual(testRecipe.title);
        });

        it('should return 404 for non-existent recipe', async () => {
            const res = await request(app)
                .get('/api/recipes/999999');

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('Recipe not found');
        });
    });
});