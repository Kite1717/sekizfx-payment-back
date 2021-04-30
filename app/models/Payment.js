"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define(
    "Payments",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      from: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      to: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultvalue: 0,
      },
      type: {
        type: DataTypes.INTEGER,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      creatorUserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      processID: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      tc: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      iban: {
        type: DataTypes.STRING,
      },
      bankId: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "payments",
      timestamps: false,
    }
  );

  return Payments;
};
