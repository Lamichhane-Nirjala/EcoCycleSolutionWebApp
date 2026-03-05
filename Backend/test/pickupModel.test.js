const Pickup = require('../Model/pickupModel');

describe('Pickup Model', () => {
  describe('Model Definition', () => {
    it('should have required fields', () => {
      const fields = Object.keys(Pickup.rawAttributes);

      expect(fields).toContain('id');
      expect(fields).toContain('userId');
      expect(fields).toContain('location');
      expect(fields).toContain('status');
    });

    it('should have userId as required field', () => {
      expect(Pickup.rawAttributes.userId.allowNull).toBe(false);
    });

    it('should have location as required field', () => {
      expect(Pickup.rawAttributes.location.allowNull).toBe(false);
    });

    it('should have status field with default value', () => {
      expect(Pickup.rawAttributes.status.defaultValue).toBeDefined();
    });
  });

  describe('Associations', () => {
    it('should be associated with User model', () => {
      expect(Pickup.associations.User).toBeDefined();
    });
  });
});
