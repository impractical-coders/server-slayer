'use strict';

const playerModel = (sequelize, DataTypes) => sequelize.define ('player',

  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUsername: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    gamesPlayed: {
      type: DataTypes.INTEGER,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    time: { type: DataTypes.STRING, allowNull: false },
  });

module.exports = playerModel;