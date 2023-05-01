/** @format */

const playerInventoryModel = (sequelize, DataTypes) =>
  sequelize.define('playerInventory', {
    players: { type: DataTypes.STRING, required: true },
    addPlayer: { type: DataTypes.STRING, required: true },
    getPlayer: { type: DataTypes.STRING, required: true },
    deletePlayer: { type: DataTypes.STRING, required: true },
    searchPlayer: { type: DataTypes.STRING, required: true},
    authenticate: { type: DataTypes.STRING, allowNull: false },
    playerId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id',
      },
    },
  });

module.exports = playerInventoryModel;
