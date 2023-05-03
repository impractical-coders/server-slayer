'use strict';

//changed it to sevral from app
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

describe('Auth router', () => {
  it('creates an admin', async () => {
    let response = await request.post('/signup').send({
      username: 'ryanbagan21',
      password: 'peacewalker21',
      role: 'admin',
    });
    //changed it to 201 from 200
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toString('ryanbagan21');

  });

  it('logs in an admin', async () => {
    let response = await request.post('/signin').auth('ryanbagan21', 'peacewalker21');
    expect(response.status).toString(200);
    expect(response.body.user.username).toString('ryanbagan21');

  });

  it('fails to log in admin with incorrect password', async () => {
    let response = await request.post('/signin').auth('ryanbagan21', 'deathstroke');
    expect(response.status).toEqual(403);
  },
  );

  it('fails to log in admin with incorrect username', async () => {
    let response = await request.post('/signin').auth('ninja', 'deathstroke');
    expect(response.status).toEqual(403);
  },
  );

  it('fails to log in an admin with no basic header', async () => {
    let response = await request.post('/signin');
    expect(response.status).toEqual(403);
  },
  );

});
