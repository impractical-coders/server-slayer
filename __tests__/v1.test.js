'use strict';

const { server } = require('../src/auth/server');
const supertest = require('supertest');
const { db } = require('../src/auth/models');
const request = supertest(server);

beforeAll(async () => {
 
  await db.sync();
 
});

afterAll(async () => {
  await db.drop();
});

describe('v1 routes', () => {
  it('creates a player item', async () => {
    let response = await request.post('/api/v1/blogs').send({
      username: 'johnnyboy',
      email: 'johnnywick@yahoo.com',
    });
    expect(response.status).toEqual(201);
    expect(response.body.name).toString('johnnyboy');
  });

  it('gets all player items', async () => {
    let response = await request.get('/api/v1/player');
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toString('johnnyboy');
  },
  );

  it('updates a player item', async () => {
    let response = await request.put('/api/v1/player/1').send({
      username: 'johnnyboy',
      email: 'johnnywick@yahoo.com',
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toString('johnnyboy');
  },
  );
});
