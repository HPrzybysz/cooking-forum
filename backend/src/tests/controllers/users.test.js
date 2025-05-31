const request = require('supertest');
const { app, db, cleanup } = require('../testHelper');
const User = require('../../models/User');

describe('User Controller', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: 'password123'
        };

        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);

        const userId = await User.create(testUser);
        testUser.id = userId;
    });

    afterAll(async () => {
        await cleanup();
    });

    describe('GET /api/users/me', () => {
        beforeAll(async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            authToken = loginRes.body.token;
        });

        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.user.email).toEqual(testUser.email);
        });

        it('should reject unauthorized access', async () => {
            const res = await request(app)
                .get('/api/users/me');

            expect(res.statusCode).toEqual(401);
        });
    });
});