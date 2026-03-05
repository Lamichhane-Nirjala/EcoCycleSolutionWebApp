const SequelizeMock = require('sequelize-mock');

const dbMock = new SequelizeMock();

const UserMock = dbMock.define('User', {
  id: 1,
  username: 'testuser',
  email: 'test@gmail.com',
  password: 'Nirjala@123',
  number: '1234567890',
  city: 'Test City',
  usertype: 'User',
});

describe("User Model", () => {
  it("should create a user", async () => {
    const user = await UserMock.create({
      username: 'john_doe',
      email: 'john@gmail.com',
      password: 'Password@123',
      number: '9876543210',
      city: 'Kathmandu',
      usertype: 'User',
    });

    expect(user.username).toBe('john_doe');
    expect(user.email).toBe('john@gmail.com');
    expect(user.city).toBe('Kathmandu');
    expect(user.usertype).toBe('User');
    expect(user.number).toBe('9876543210');
  });
});
