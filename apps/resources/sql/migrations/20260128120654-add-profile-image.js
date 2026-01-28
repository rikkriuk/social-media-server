'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profile', 'profile_image', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profile', 'profile_image');
  }
};
