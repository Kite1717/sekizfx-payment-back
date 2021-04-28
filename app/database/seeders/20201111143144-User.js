'use strict';

const bcrypt = require('bcrypt');
const authConfig = require('../../../config/auth');
module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('users', [{
        email: 'sekizfx_admin@sekizfx.com',
        password: bcrypt.hashSync('B6jGbFwAm3jsV6w', +authConfig.rounds),
      }], {});
  
  },

  down: async (queryInterface, Sequelize) => {
  
     await queryInterface.bulkDelete('users', null, {});
     
  }
};
