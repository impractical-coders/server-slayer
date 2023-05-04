'use strict';

const base64 = require('base-64');
const middleware = require('../src/auth/middleware');
const { admin } = require('../src/auth/models');

describe('middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  describe('when authorization header is missing', () => {
    it('should return 403 with an error message', async () => {
      await middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('Invalid Login Credentials');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when authorization header is present', () => {
    beforeEach(() => {
      req.headers.authorization = `Basic ${base64.encode('user:pass')}`;
    });

    describe('when authentication succeeds', () => {
      it('should set req.user and call next', async () => {
        admin.authenticateBasic = jest.fn().mockResolvedValue('user');
        await middleware(req, res, next);
        expect(admin.authenticateBasic).toHaveBeenCalledWith('user', 'pass');
        expect(req.user).toBe('user');
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
      });
    });

    describe('when authentication fails', () => {
      it('should return 403 with an error message', async () => {
        admin.authenticateBasic = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
        await middleware(req, res, next);
        expect(admin.authenticateBasic).toHaveBeenCalledWith('user', 'pass');
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Invalid Login Credentials');
      });
    });
  });
});
