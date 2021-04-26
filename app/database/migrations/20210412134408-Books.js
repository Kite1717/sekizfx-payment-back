'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookName: {
        type: Sequelize.STRING,
      },
      bookCoverImage: {
        type: Sequelize.STRING,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
