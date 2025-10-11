'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

      await queryInterface.addColumn('users', 'uuid', {
         type: Sequelize.UUID,
         allowNull: false,
         defaultValue: Sequelize.literal('gen_random_uuid()'),
      });

      await queryInterface.addIndex('users', ['uuid'], { unique: true, name: 'users_uuid_unique' });

      const tableInfo = await queryInterface.describeTable('otp_codes');
      if (!tableInfo.used) {
         await queryInterface.addColumn('otp_codes', 'used', {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
         });
      }
   },

   down: async (queryInterface, Sequelize) => {
      const tableInfo = await queryInterface.describeTable('otp_codes');
      if (tableInfo.used) {
         await queryInterface.removeColumn('otp_codes', 'used');
      }

      await queryInterface.removeIndex('users', 'users_uuid_unique');
      await queryInterface.removeColumn('users', 'uuid');
   },
};
