'use strict';

const errorHandler = require('../src/auth/error-handlers/500');

describe('errorHandler', () => {
  it('should return a 500 error with the error message', () => {
    const err = new Error('Something went wrong');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Something went wrong',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors without a message property', () => {
    const err = { someKey: 'someValue' };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: { someKey: 'someValue' },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
