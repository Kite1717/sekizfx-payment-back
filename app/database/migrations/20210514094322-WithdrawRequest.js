"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("withdrawRequest", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      from: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      to: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      amount: {
        allowNull: false,
        type: Sequelize.REAL,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tc: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      iban: {
        type: Sequelize.STRING,
      },
      bankId: {
        type: Sequelize.STRING,
      },
      createdAt:{
        type: Sequelize.DATE,
      },
      status:{
        defaultValue : 0,
        type: Sequelize.INTEGER,
      }
      
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
