'use strict';

const userService = require('../src/services/userService');
const password = require('../src/utils/password');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hashedPassword = password.hashPassword('0masacalda');
    const admin = {
      first_name: 'Admin',
      last_name: 'Admin',
      email: 'admin@omasacalda.ro',
      phone: '0766000000',
      password: hashedPassword.pass,
      salt: hashedPassword.salt,
      type: 'admin'
    };
    return userService.save(admin);
  },

  down: (queryInterface, Sequelize) => {}
};
