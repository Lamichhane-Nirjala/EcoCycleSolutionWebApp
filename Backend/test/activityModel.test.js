const Activity = require('../Model/activityModel');

describe('Activity Model', () => {
  describe('Model Definition', () => {
    it('should have required fields', () => {
      const fields = Object.keys(Activity.rawAttributes);

      expect(fields).toContain('id');
      expect(fields).toContain('userId');
      expect(fields).toContain('activityType');
      expect(fields).toContain('description');
    });

    it('should have userId as required field', () => {
      expect(Activity.rawAttributes.userId.allowNull).toBe(false);
    });

    it('should have activityType as required field', () => {
      expect(Activity.rawAttributes.activityType.allowNull).toBe(false);
    });

    it('should have timestamp fields', () => {
      const fields = Object.keys(Activity.rawAttributes);
      expect(fields).toContain('createdAt');
      expect(fields).toContain('updatedAt');
    });
  });

  describe('Associations', () => {
    it('should be associated with User model', () => {
      expect(Activity.associations.User).toBeDefined();
    });
  });
});
