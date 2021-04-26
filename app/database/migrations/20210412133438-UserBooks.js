'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('usersbooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: { model: 'books', key: 'id' }
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
