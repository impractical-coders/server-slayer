'use strict';

const booksModel = (sequelize, DataTypes) => sequelize.define('books', {
  name: { type: DataTypes.STRING, required: true },
  price: { type: DataTypes.INTEGER, required: false },
  type: { type: DataTypes.STRING, required: false },
});

module.exports = booksModel;
