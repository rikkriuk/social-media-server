'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('profile', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    }).catch(() => {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('profile', 'bio').catch(() => {});
  }
};
