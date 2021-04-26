'use strict';

const bcrypt = require('bcrypt');
const authConfig = require('../../../config/auth');
module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('users', [{
        fullName: 'Admin Minipoi',
        email: 'minipoi@gmail.com',
        username : 'minipoi',
        role: 0,
        password: bcrypt.hashSync('Mminipoi2021', +authConfig.rounds),
      }], {});
  
  },

  down: async (queryInterface, Sequelize) => {
  
     await queryInterface.bulkDelete('users', null, {});
     
  }
};
