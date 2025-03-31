const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/index");

const Person = sequelize.define(
  "Person",
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
    height: {
      type: DataTypes.STRING,
    },
    mass: {
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
    tableName: "persons",
    freezeTableName: true
  }
);

module.exports = Person;
