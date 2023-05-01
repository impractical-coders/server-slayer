'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const adminModel = require('./admin');
const playerModel = require('./players/model');
const Collection = require('./data-collection');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const sequelizeDataBase = new Sequelize(DATABASE_URL);
const players = playerModel(sequelizeDataBase, DataTypes);

module.exports = {
  db: sequelizeDataBase,
  admin: adminModel( sequelizeDataBase, players),
  players: new Collection(players),
};