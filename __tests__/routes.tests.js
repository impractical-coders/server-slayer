'use strict';

const request = require('supertest');
const app = require('../src/auth/routes');

describe('Authentication routes', () => {
  let token;

  beforeAll(async () => {
    // create a user and get the token
    const response = await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
        role: 'admin',
      });
    token = response.body.token;
  });

  describe('POST /signup', () => {
    test('should create a new user', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'newuser',
          password: 'newpassword',
          role: 'user',
        });
      expect(response.status).toBe(201);
      expect(response.body.user.username).toBe('newuser');
    });

    test('should return an error for invalid input', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'testuser',
          password: 'testpassword',
          role: 'admin',
        });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /signin', () => {
    test('should sign in a user', async () => {
      const response = await request(app)
        .post('/signin')
        .set('Authorization', `Basic ${Buffer.from('testuser:testpassword').toString('base64')}`);
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('testuser');
      expect(response.body).toHaveProperty('token');
    });

    test('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/signin')
        .set('Authorization', `Basic ${Buffer.from('testuser:wrongpassword').toString('base64')}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /admin', () => {
    test('should return a list of users for admin', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test('should return an error for non-admin', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /slayers', () => {
    test('should return a message for authorized users', async () => {
      const response = await request(app)
        .get('/slayers')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.text).toBe('WELCOME TO YOUR DEMISE!');
    });

    test('should return an error for unauthorized users', async () => {
      const response = await request(app)
        .get('/slayers');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
