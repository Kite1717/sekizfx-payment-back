'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('answers', {
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
      exerciseId: {
        type: Sequelize.INTEGER,
        references: { model: 'bookexercises', key: 'id' }
      },
      isTrue:{
        type: Sequelize.BOOLEAN,
        defaultValue:false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
