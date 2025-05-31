const request = require('supertest');
const { app } = require('../../app');
const db = require('../../config/db');
const User = require('../../models/User');

describe('User Controller', () => {
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123'
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
    });

    afterAll(async () => {
        await global.cleanup();
    });

    describe('GET /api/users/me', () => {
        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('email', testUser.email);
        });
    });
});