const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sql.js");

const userTable = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ispremium: {
    type: DataTypes.BOOLEAN,
  },
  totalexpense: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
});

module.exports = userTable;
