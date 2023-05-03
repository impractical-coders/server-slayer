'use strict';

const { Sequelize } = require('sequelize');
const adminModel = require('../src/auth/models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'HIDE FROME ME';

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

describe('adminModel', () => {
  let Admin;
  beforeAll(async () => {
    Admin = adminModel(sequelize, Sequelize.DataTypes);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Admin.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('beforeCreate hook', () => {
    test('should hash the password', async () => {
      const admin = await Admin.create({
        username: 'testuser',
        password: 'testpass',
      });

      expect(admin.password).not.toBe('testpass');
      expect(await bcrypt.compare('testpass', admin.password)).toBe(true);
    });
  });

  describe('authenticateBasic method', () => {
    test('should return the user if credentials are valid', async () => {
      await Admin.create({
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
      });

      const user = await Admin.authenticateBasic('testuser', 'testpass');
      expect(user.username).toBe('testuser');
    });

    test('should throw an error if credentials are invalid', async () => {
      await Admin.create({
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
      });

      await expect(Admin.authenticateBasic('testuser', 'wrongpass')).rejects.toThrow('Invalid User');
    });
  });

  describe('authenticateToken method', () => {
    test('should return the user if token is valid', async () => {
      const admin = await Admin.create({
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
      });

      const token = jwt.sign({ username: 'testuser' }, SECRET);
      admin.token = token;
      await admin.save();

      const user = await Admin.authenticateToken(token);
      expect(user.username).toBe('testuser');
    });

    test('should throw an error if token is invalid', async () => {
      await expect(Admin.authenticateToken('invalidtoken')).rejects.toThrow('jwt malformed');
    });

    test('should throw an error if user is not found', async () => {
      const token = jwt.sign({ username: 'testuser' }, SECRET);
      await expect(Admin.authenticateToken(token)).rejects.toThrow('User Not Found');
    });
  });
});
