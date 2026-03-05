const adminAuthMiddleware = require('../Middleware/adminAuth');

describe('Admin Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      userType: 'Admin'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if user is admin', () => {
    adminAuthMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if user is not admin', () => {
    req.userType = 'User';

    adminAuthMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Admin access required'
    });
  });

  it('should return 403 if userType is missing', () => {
    req.userType = undefined;

    adminAuthMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
