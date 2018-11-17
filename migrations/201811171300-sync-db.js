'use strict';

const db = require('../src/models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    // db.sequelize.sync({ force: true });
  },

  down: (queryInterface, Sequelize) => {}
};
