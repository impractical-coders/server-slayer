const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const bcrypt = require('bcrypt');

class Player extends Model {

  checkPassword(loginPassword) {
    return bcrypt.compareSync(loginPassword, this.password);
  }
}

Player.init(
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
  },
  {
    hooks: {

      beforeCreate: async (newPlayerData) => {
        newPlayerData.password = await bcrypt.hash(newPlayerData.pasword, 5);
        return newPlayerData;
      },
      beforeUpdate: async (updatePlayerData) => {
        updatePlayerData.password = await bcrypt.hash(updatePlayerData.password, 5);
        return updatePlayerData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName:'players',
  },
);

module.exports = Player;