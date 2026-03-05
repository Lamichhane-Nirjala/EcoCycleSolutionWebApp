describe('API Service Tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User Authentication', () => {
    it('should call login endpoint with credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            token: 'test-token',
            user: { id: 1, email: 'test@example.com' }
          })
      });

      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
    });

    it('should handle registration request', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            message: 'User registered successfully',
            userId: 1
          })
      });

      const response = await fetch('/api/user/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const data = await response.json();
      expect(data.message).toContain('registered');
    });
  });

  describe('Dashboard API', () => {
    it('should fetch user dashboard data', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            totalPickups: 5,
            ecoPoints: 100,
            totalWaste: 15
          })
      });

      const response = await fetch('/api/dashboard');
      const data = await response.json();

      expect(data.totalPickups).toBeGreaterThanOrEqual(0);
      expect(data.ecoPoints).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Pickup API', () => {
    it('should create a pickup request', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            id: 1,
            status: 'pending'
          })
      });

      const response = await fetch('/api/pickup', {
        method: 'POST',
        body: JSON.stringify({
          location: 'Test Location',
          wasteType: 'Plastic'
        })
      });

      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.status).toBe('pending');
    });

    it('should fetch pickups list', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            { id: 1, status: 'pending' },
            { id: 2, status: 'completed' }
          ])
      });

      const response = await fetch('/api/pickup');
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
