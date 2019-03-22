'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('booking', 'company_name', {
      type: Sequelize.STRING(),
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {}
};
