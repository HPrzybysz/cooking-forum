const request = require('supertest');
const { app } = require('../../app');
const db = require('../../config/db');
const User = require('../../models/User');

describe('Auth Controller', () => {
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
        await User.create(testUser);
    });

    afterAll(async () => {
        await global.cleanup();
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should reject invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
        });
    });
});