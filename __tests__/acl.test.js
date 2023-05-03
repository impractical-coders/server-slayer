'use strict';

const checkPermissions = require('../src/auth/middleware/acl');

describe('checkPermissions middleware', () => {
  it('should call next() if the user has the required capability', () => {
    const req = {
      user: {
        capabilities: ['create', 'read', 'update']
      }
    };
    const res = {};
    const next = jest.fn();

    checkPermissions('update')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() with an error message if the user does not have the required capability', () => {
    const req = {
      user: {
        capabilities: ['create', 'read']
      }
    };
    const res = {};
    const next = jest.fn();

    checkPermissions('update')(req, res, next);

    expect(next).toHaveBeenCalledWith('Access Denied');
  });

  it('should call next() with an error message if the user object is missing or invalid', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    checkPermissions('update')(req, res, next);

    expect(next).toHaveBeenCalledWith('Invalid Login Credentials');
  });
});
