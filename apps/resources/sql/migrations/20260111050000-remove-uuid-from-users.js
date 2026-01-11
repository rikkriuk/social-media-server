'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Drop foreign keys first
    await queryInterface.removeConstraint('otp_codes', 'otp_codes_user_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('profile', 'profile_user_id_fkey').catch(() => {});

    // Drop old uuid column and index
    await queryInterface.removeIndex('users', 'users_uuid_unique').catch(() => {});
    await queryInterface.removeColumn('users', 'uuid').catch(() => {});

    // Create new UUID id column
    await queryInterface.addColumn('users', 'new_id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    });

    // Update new_id with generated UUIDs
    await queryInterface.sequelize.query(`UPDATE users SET new_id = uuid_generate_v4() WHERE new_id IS NULL;`);

    // Add new_user_id to otp_codes and profile
    await queryInterface.addColumn('otp_codes', 'new_user_id', { type: Sequelize.UUID });
    await queryInterface.addColumn('profile', 'new_user_id', { type: Sequelize.UUID });

    // Map old user_id to new_id
    await queryInterface.sequelize.query(`
      UPDATE otp_codes SET new_user_id = users.new_id
      FROM users WHERE otp_codes.user_id = users.id;
    `);
    await queryInterface.sequelize.query(`
      UPDATE profile SET new_user_id = users.new_id
      FROM users WHERE profile.user_id = users.id;
    `);

    // Drop old columns
    await queryInterface.removeColumn('otp_codes', 'user_id');
    await queryInterface.removeColumn('profile', 'user_id');

    // Rename new columns
    await queryInterface.renameColumn('otp_codes', 'new_user_id', 'user_id');
    await queryInterface.renameColumn('profile', 'new_user_id', 'user_id');

    // Drop old id and rename new_id to id
    await queryInterface.removeColumn('users', 'id');
    await queryInterface.renameColumn('users', 'new_id', 'id');

    // Add primary key constraint
    await queryInterface.addConstraint('users', {
      fields: ['id'],
      type: 'primary key',
      name: 'users_pkey',
    });

    // Make user_id not null
    await queryInterface.changeColumn('otp_codes', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.changeColumn('profile', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Add foreign keys back
    await queryInterface.addConstraint('otp_codes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'otp_codes_user_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('profile', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'profile_user_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // This is a destructive migration, rollback not fully supported
  }
};
