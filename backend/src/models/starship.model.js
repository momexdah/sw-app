const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/index");

const Starship = sequelize.define(
  "Starship",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
    },
    swapiId: {
      type: DataTypes.STRING,
      unique: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Starship;
