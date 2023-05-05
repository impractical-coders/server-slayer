'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const adminModel = require('./admin');
const playerModel = require('./players/model');
const Collection = require('./data-collection');
// const blogModel = require('./blog/model')
// const Collection = require('./data-collection');
// const userModel = require('./readers');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const sequelizeDataBase = new Sequelize(DATABASE_URL);
const players = playerModel(sequelizeDataBase, DataTypes);

// const testDataBase = async (sequelize)  => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };
// console.log(testDataBase(sequelizeDataBase));

module.exports = {
  db: sequelizeDataBase,
  admin: adminModel( sequelizeDataBase, DataTypes ),
  players: new Collection(players),
};
