const request = require('supertest');
const { app } = require('../../app');
const db = require('../../config/db');
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');

describe('Recipe Controller', () => {
    const testUser = {
        firstName: 'Recipe',
        lastName: 'Tester',
        email: 'recipe@test.com',
        password: 'password123'
    };

    const testRecipe = {
        title: 'Test Recipe',
        description: 'Test Description',
        prep_time: 30,
        servings: 4
    };

    let authToken;

    beforeAll(async () => {
        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
        testUser.id = await User.create(testUser);

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        authToken = loginRes.body.token;

        await db.execute('DELETE FROM recipes WHERE title = ?', [testRecipe.title]);
    });

    afterAll(async () => {
        await global.cleanup();
    });

    describe('POST /api/recipes', () => {
        it('should create a new recipe', async () => {
            const res = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testRecipe);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('recipeId');
        });

        it('should reject missing required fields', async () => {
            const invalidRecipe = {...testRecipe};
            delete invalidRecipe.title;

            const res = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidRecipe);

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/recipes/:id', () => {

        it('should return 404 for non-existent recipe', async () => {
            const res = await request(app)
                .get('/api/recipes/2137');

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('Recipe not found');
        });
    });
});