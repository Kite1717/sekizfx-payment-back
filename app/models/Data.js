"use strict";

module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define(
    "Data",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      data: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "data",
      timestamps: false,
    }
  );

  return Data;
};
