'use strict';

const handle404 = require('../src/auth/error-handlers/404');

describe('handle404', () => {
  it('should return a 404 error with a message', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    handle404(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Sorry, we could not find what you were looking for',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
