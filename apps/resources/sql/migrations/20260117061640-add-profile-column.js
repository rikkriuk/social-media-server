'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('profile', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('profile', 'bio');
  }
};
