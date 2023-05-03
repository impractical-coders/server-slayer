'use strict';

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v2');

const app = express();
app.use(express.json());
app.use(router);

describe('router tests', () => {
  it('should get all records', async () => {
    const response = await request(app).get('/model');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('should get one record by id', async () => {
    const response = await request(app).get('/model/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });

  it('should create a new record', async () => {
    const response = await request(app)
      .post('/model')
      .send({ name: 'test', value: '123' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.name).toBe('test');
    expect(response.body.value).toBe('123');
  });

  it('should update an existing record', async () => {
    const response = await request(app)
      .put('/model/1')
      .send({ name: 'test', value: '456' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('test');
    expect(response.body.value).toBe('456');
  });

  it('should delete an existing record', async () => {
    const response = await request(app).delete('/model/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.id).toBe(1);
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
//     let response = await request.post('/api/v2/players').send({
//       username: 'johnnyboy',
//       email: 'johnnywick@yahoo.com',
//     });
//     expect(response.status).toEqual(201);
//     expect(response.body.name).toString('johnnyboy');
//   });

//   it('gets all player items', async () => {
//     let response = await request.get('/api/v2/players');
//     expect(response.status).toEqual(200);
//     expect(response.body[0].name).toString('johnnyboy');
//   },
//   );

//   it('updates a player item', async () => {
//     let response = await request.put('/api/v2/players/1').send({
//       username: 'johnnyboy',
//       email: 'johnnywick@yahoo.com',
//     });
//     expect(response.status).toEqual(200);
//     expect(response.body.name).toString('johnnyboy');
//   },
//   );
// });
