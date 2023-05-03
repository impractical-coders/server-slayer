'use strict';

const playerModel = (sequelize, DataTypes) => sequelize.define('player', {
  username: { type: DataTypes.STRING, required: true },
  email: { type: DataTypes.STRING, required: true },
  gamesplayed: { type: DataTypes.INTEGER, required: true },
  banned: { type: DataTypes.BOOLEAN, required: true },
  time: { type: DataTypes.STRING, allowNull: true },
});

module.exports = playerModel;
