'use strict';

const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../src/routes/v1');

// Create a mock data module for testing purposes
const dataModules = {
  TestModel: {
    get: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mount the router middleware
app.use('/test', router);

describe('router', () => {
  describe('GET /test', () => {
    it('should return all records', async () => {
      dataModules.TestModel.get.mockResolvedValue([{ id: 1, name: 'Test' }]);
      const res = await request(app).get('/test');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ id: 1, name: 'Test' }]);
    });
  });

  describe('GET /test/:id', () => {
    it('should return a single record', async () => {
      dataModules.TestModel.getOne.mockResolvedValue({ id: 1, name: 'Test' });
      const res = await request(app).get('/test/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ id: 1, name: 'Test' });
    });
  });

  describe('POST /test', () => {
    it('should create a new record', async () => {
      const newRecord = { name: 'Test' };
      dataModules.TestModel.create.mockResolvedValue({ id: 1, ...newRecord });
      const res = await request(app).post('/test').send(newRecord);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ id: 1, ...newRecord });
    });
  });

  describe('PUT /test/:id', () => {
    it('should update an existing record', async () => {
      const updatedRecord = { name: 'Updated Test' };
      dataModules.TestModel.update.mockResolvedValue({ id: 1, ...updatedRecord });
      const res = await request(app).put('/test/1').send(updatedRecord);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ id: 1, ...updatedRecord });
    });
  });

  describe('DELETE /test/:id', () => {
    it('should delete an existing record', async () => {
      dataModules.TestModel.delete.mockResolvedValue({ id: 1 });
      const res = await request(app).delete('/test/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ id: 1 });
    });
  });
});

// const { server } = require('../src/auth/server');
// const supertest = require('supertest');
// const { db } = require('../src/auth/models');
// const request = supertest(server);

// beforeAll(async () => {
 
//   await db.sync();
 
// });

// afterAll(async () => {
//   await db.drop();
// });

// describe('v1 routes', () => {
//   it('creates a player item', async () => {
//     let response = await request.post('/api/v1/players').send({
//       username: 'johnnyboy',
//       email: 'johnnywick@yahoo.com',
//     });
//     expect(response.status).toEqual(201);
//     expect(response.body.name).toString('johnnyboy');
//   });

//   it('gets all player items', async () => {
//     let response = await request.get('/api/v1/players');
//     expect(response.status).toEqual(200);
//     expect(response.body[0].name).toString('johnnyboy');
//   },
//   );

//   it('updates a player item', async () => {
//     let response = await request.put('/api/v1/players/1').send({
//       username: 'johnnyboy',
//       email: 'johnnywick@yahoo.com',
//     });
//     expect(response.status).toEqual(200);
//     expect(response.body.name).toString('johnnyboy');
//   },
//   );
// });
