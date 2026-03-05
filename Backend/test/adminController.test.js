const adminController = require('../Controller/adminController');

describe('Admin Controller', () => {
  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await adminController.getDashboardStats(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await adminController.getAllUsers(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await adminController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    });
  });
});
