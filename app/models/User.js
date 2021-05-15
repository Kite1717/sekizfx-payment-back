"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      qr_code: {
        defaultValue :false,
        type: DataTypes.BOOLEAN,
      },
      qr_code_image: {
        type: DataTypes.STRING,
      },
      qr_code_secret: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
