const errorHandler = require('../Middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should handle generic error', () => {
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle validation errors', () => {
    const error = new Error('Invalid input');
    error.statusCode = 400;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle database errors', () => {
    const error = new Error('Database connection failed');
    error.statusCode = 500;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should handle authentication errors', () => {
    const error = new Error('Unauthorized');
    error.statusCode = 401;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should handle authorization errors', () => {
    const error = new Error('Forbidden');
    error.statusCode = 403;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should handle not found errors', () => {
    const error = new Error('Resource not found');
    error.statusCode = 404;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
