'use strict';

const City = require('../src/models').city;

module.exports = {
  up: (queryInterface, Sequelize) => {
    const cities = [
      {
        name: 'Cluj-Napoca'
      }
    ];

    return City.bulkCreate(cities);
  },

  down: (queryInterface, Sequelize) => {}
};
