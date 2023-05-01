'use strict';

const bcrypt = require('bcyrpt');
const jwt = require('jsonwebtoken');
const { admin } = require('.');

const SECRET = process.env.SECRET || 'You\'ve entered the chat';

const adminModel = (sequelize, DataTypes) => {
  const model = sequelize.define('adminstrators', {
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

  adminModel.create({
    email: 'kam.watts@gmail.com',
    isAdmin: true,
  });

  adminModel.create({
    email: 'thecreator85@gmail.com',
    isAdmin: true,
  });

  adminModel.create({
    email: 'darcknight1980@gmail.com',
    isAdmin: true,
  });

  adminModel.create({
    email: 'parathomas@gmail.com',
    isAdmin: true,
  });

  // Method to confirm if an email address has admin capabilities
  admin.findOne({
    where: { email: 'kam.watts@gmail.com'},
  }).then( admin => {
    if (admin && admin.isAdmin) {
      alert('You have full administrator access');
    } else {
      console.log('This is a non-admin account');
    }
  });

  admin.findOne({
    where: { email: 'thecreator85@gmail.com'},
  }).then( admin => {
    if (admin && admin.isAdmin) {
      alert('You have full administrator access');
    } else {
      console.log('This is a non-admin account');
    }
  });

  admin.findOne({
    where: { email: 'darcknight1980@gmail.com'},
  }).then( admin => {
    if (admin && admin.isAdmin) {
      alert('You have full administrator access');
    } else {
      console.log('This is a non-admin account');
    }
  });

  admin.findOne({
    where: { email: 'parathomas@gmail.com'},
  }).then( admin => {
    if (admin && admin.isAdmin) {
      alert('You have full administrator access');
    } else {
      console.log('This is a non-admin account');
    }
  });

  model.beforeCreate( async (player) => {
    let hashedPassword = await bcrypt.hash(player.password, 5);
    player.password = hashedPassword;
  });
  model.authenticateBasic = async function (username, password) {
    const player = await this.findOne( { where: {username } });
    const valid = await bcrypt.compare(password, player.password);
    if(valid) { return player; }
    throw new Error('Invalid Player Name');
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const player = await this.findOne( { where: { username: parsedToken.username } });
      if(player) { return player; }
      throw new Error('Player not found');
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return model;
};

module.exports = adminModel;