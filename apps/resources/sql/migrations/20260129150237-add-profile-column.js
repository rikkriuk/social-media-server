'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profile', 'cover_image', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profile', 'cover_image');
  }
};
