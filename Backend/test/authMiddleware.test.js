const authMiddleware = require('../Middleware/auth');
const jwt = require('../Utils/jwt');

jest.mock('../Utils/jwt');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid.jwt.token'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if token is valid', () => {
    jwt.verifyToken = jest.fn().mockReturnValue({ userId: 1 });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(1);
  });

  it('should return 401 if no token provided', () => {
    req.headers.authorization = undefined;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    jwt.verifyToken = jest.fn().mockReturnValue(null);

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
