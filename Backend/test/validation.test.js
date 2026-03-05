const { validateRegistration, validateLogin } = require('../Middleware/validation');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateRegistration', () => {
    it('should call next with valid registration data', () => {
      req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          phoneNumber: '9841234567'
        }
      };

      validateRegistration(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return error with missing required fields', () => {
      req = {
        body: {
          email: 'test@example.com'
        }
      };

      validateRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return error with invalid email', () => {
      req = {
        body: {
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!',
          phoneNumber: '9841234567'
        }
      };

      validateRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateLogin', () => {
    it('should call next with valid login data', () => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return error with missing email', () => {
      req = {
        body: {
          password: 'Password123!'
        }
      };

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
