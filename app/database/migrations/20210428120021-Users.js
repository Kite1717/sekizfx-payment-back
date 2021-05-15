"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      qr_code: {
        defaultValue :false,
        type: Sequelize.BOOLEAN,
      },
      qr_code_image: {
        type: Sequelize.STRING,
      },
      qr_code_secret: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
