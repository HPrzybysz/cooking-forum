const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const User = require('../../models/User');

describe('Auth Controller', () => {
    let testUser;

    beforeAll(async () => {
        testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'password123'
        };

        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
        await User.create(testUser);
    });

    afterAll(async () => {
        await db.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toEqual(testUser.email);
        });

        it('should reject invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid credentials');
        });
    });

    describe('POST /api/auth/register', () => {
        const newUser = {
            firstName: 'New',
            lastName: 'User',
            email: 'new@example.com',
            password: 'newpassword123'
        };

        afterEach(async () => {
            await db.execute('DELETE FROM users WHERE email = ?', [newUser.email]);
        });

        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body.user.email).toEqual(newUser.email);
        });

        it('should reject duplicate email', async () => {
            await request(app).post('/api/auth/register').send(newUser);

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(409);
            expect(res.body.error).toEqual('Email already exists');
        });
    });
});