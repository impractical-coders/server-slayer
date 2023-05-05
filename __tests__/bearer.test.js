'use strict';

const bearerAuth = require('../src/auth/middleware/bearer');
const { admin } = require('../src/auth/models');

describe('Bearer Auth Middleware', () => {
  let req = {};
  let res = {};
  let next = jest.fn();

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
  });

  it('should add user and token to req object', async () => {
    const user = {
      username: 'testuser',
      token: 'testtoken',
    };
    const authenticateToken = jest.spyOn(admin, 'authenticateToken').mockResolvedValue(user);

    req.headers.authorization = 'Bearer testtoken';

    await bearerAuth(req, res, next);

    expect(authenticateToken).toHaveBeenCalledWith('testtoken');
    expect(req.user).toEqual(user);
    expect(req.token).toEqual('testtoken');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return error for missing authorization header', async () => {
    await bearerAuth(req, res, next);

    expect(next).toHaveBeenCalledWith('Invalid Login Credentials');
  });

  it('should return error for invalid token', async () => {
    const authenticateToken = jest.spyOn(admin, 'authenticateToken').mockRejectedValue(new Error('Invalid Token'));

    req.headers.authorization = 'Bearer invalidtoken';

    await bearerAuth(req, res, next);

    expect(authenticateToken).toHaveBeenCalledWith('invalidtoken');
    expect(next).toHaveBeenCalledWith('Invalid Login Credentials');
  });
});
