'use strict';

const slugify = require('slugify');
const City = require('../src/models').city;

module.exports = {
  up: (queryInterface, Sequelize) => {
    const cities = [
      {
        name: 'Cluj-Napoca'
      }
    ];

    const citiesData = cities.map((item) => {
      return ({
        ...item,
        slug: slugify(item.name, {
          lower: true 
        })
      })
    })

    return City.bulkCreate(citiesData);
  },

  down: (queryInterface, Sequelize) => {}
};
