"use strict";

module.exports = (sequelize, DataTypes) => {
  const Code = sequelize.define(
    "Code",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      bookRegistrationCode: {
        type: DataTypes.STRING,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "codes",
      paranoid: true,
      timestamps: true,
    }
  );

  return Code;
};
