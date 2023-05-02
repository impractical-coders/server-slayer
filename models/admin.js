'use strict';

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'You\'ve entered the chat';

const adminModel = (sequelize, DataTypes) => {
  const admin = sequelize.define('adminstrators', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    username: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    role: { type: DataTypes.ENUM('player', 'admin'), defaultValue: 'admin' },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },

    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          player: ['update'],
          admin: ['create', 'read', 'update', 'delete'],
        };
        return acl[this.role];
      },
    },
  });

  return admin;
};

module.exports = adminModel;
