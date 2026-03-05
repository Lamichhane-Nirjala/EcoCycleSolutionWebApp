const activityController = require('../Controller/activityController');

describe('Activity Controller', () => {
  describe('logActivity', () => {
    it('should log a new user activity', async () => {
      const req = {
        body: {
          userId: 1,
          activityType: 'pickup_completed',
          description: 'User completed a waste pickup'
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await activityController.logActivity(req, res);
      expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    });
  });

  describe('getUserActivities', () => {
    it('should retrieve user activities', async () => {
      const req = { params: { userId: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await activityController.getUserActivities(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getActivityStats', () => {
    it('should return activity statistics', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await activityController.getActivityStats(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
