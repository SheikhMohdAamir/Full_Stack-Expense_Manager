const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sql.js");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  payment_id:DataTypes.STRING,
  order_id:DataTypes.STRING,
  status:DataTypes.STRING
});

module.exports = Order;