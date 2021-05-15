"use strict";

module.exports = (sequelize, DataTypes) => {
  const WReq = sequelize.define(
    "WReq",
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
          amount: {
            allowNull: false,
            type: DataTypes.REAL,
          },
          userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
          createdAt:{
            type: DataTypes.DATE,
          },
          status:{
            defaultValue : 0,
            type: DataTypes.INTEGER,
          }
    },
    {
      tableName: "withdrawRequest",
      timestamps: false,
    }
  );

  return WReq;
};
