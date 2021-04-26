'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      role:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      username:{
        allowNull: false,
        type: Sequelize.STRING
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
