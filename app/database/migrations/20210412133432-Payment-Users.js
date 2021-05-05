"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("payments", {
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
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultvalue: 0,
      },
      type: {
        type: Sequelize.INTEGER,
      },
      amount: {
        allowNull: false,
        type: Sequelize.REAL,
      },
      creatorUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      processID: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
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
      txID: {
        type: Sequelize.STRING,
      },
      btcAmt: {
        type: Sequelize.REAL,
      },
      
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
