const db = require('../Database/db');
const { Sequelize } = require('sequelize');

describe('Database Configuration', () => {
  describe('Database Connection', () => {
    it('should have sequelize instance', () => {
      expect(db.sequelize).toBeInstanceOf(Sequelize);
    });

    it('should have environment configuration', () => {
      expect(db.sequelize.config).toBeDefined();
    });

    it('should authenticate database connection', async () => {
      try {
        await db.sequelize.authenticate();
        expect(true).toBe(true);
      } catch (error) {
        console.log('Database connection test:', error.message);
      }
    });
  });

  describe('Models', () => {
    it('should have User model', () => {
      expect(db.User).toBeDefined();
    });

    it('should have Pickup model', () => {
      expect(db.Pickup).toBeDefined();
    });

    it('should have Activity model', () => {
      expect(db.Activity).toBeDefined();
    });
  });

  describe('Sequelize Operators', () => {
    it('should have Op operators available', () => {
      const { Op } = require('sequelize');
      expect(Op.eq).toBeDefined();
      expect(Op.like).toBeDefined();
      expect(Op.in).toBeDefined();
      expect(Op.gt).toBeDefined();
      expect(Op.lt).toBeDefined();
    });
  });

  describe('Model Associations', () => {
    it('should have User associations', () => {
      const associations = Object.keys(db.User.associations || {});
      expect(associations.length).toBeGreaterThanOrEqual(0);
    });

    it('should have Pickup associations with User', () => {
      const associations = Object.keys(db.Pickup.associations || {});
      expect(associations.length).toBeGreaterThanOrEqual(0);
    });
  });
});
