'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const adminModel = require('./admin');
const playerModel = require('./players/model');
const Collection = require('./data-collection');

const DATABASE_URL =   process.env.DATABASE_URL || 'sqlite:memory';

const sequelizeDataBase = new Sequelize(DATABASE_URL);
const players = playerModel(sequelizeDataBase, DataTypes);

const testDataBase = async (sequelize)  => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
console.log(testDataBase(sequelizeDataBase));

module.exports = {
  db: sequelizeDataBase,
  admin: adminModel( sequelizeDataBase, DataTypes ),
  players: new Collection(players),
};
