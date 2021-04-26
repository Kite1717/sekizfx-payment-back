'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('userstatus', {
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
      attainmentName: {
        type: Sequelize.STRING,
      },
      attainmentAmount: {
        type: Sequelize.REAL,
      },
      attainmentDescription:{
        type: Sequelize.STRING
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
