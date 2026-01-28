'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Drop foreign keys first
    await queryInterface.removeConstraint('otp_codes', 'otp_codes_user_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('profile', 'profile_user_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('user_follows', 'user_follows_follower_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('user_follows', 'user_follows_following_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('posts', 'posts_profile_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('comments', 'comments_profile_id_fkey').catch(() => {});
    await queryInterface.removeConstraint('likes', 'likes_profile_id_fkey').catch(() => {});

    // Drop old uuid column and index
    await queryInterface.removeIndex('users', 'users_uuid_unique').catch(() => {});
    await queryInterface.removeColumn('users', 'uuid').catch(() => {});

    // Create new UUID id column
    await queryInterface.addColumn('users', 'new_id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    }).catch(() => {});

    // Update new_id with generated UUIDs
    await queryInterface.sequelize.query(`UPDATE users SET new_id = uuid_generate_v4() WHERE new_id IS NULL;`);

    // Add new columns to tables that reference profile
    await queryInterface.addColumn('posts', 'new_profile_id', { type: Sequelize.UUID }).catch(() => {});
    await queryInterface.addColumn('comments', 'new_profile_id', { type: Sequelize.UUID }).catch(() => {});
    await queryInterface.addColumn('likes', 'new_profile_id', { type: Sequelize.UUID }).catch(() => {});

    // Add new columns to user_follows
    await queryInterface.addColumn('user_follows', 'new_follower_id', { type: Sequelize.UUID }).catch(() => {});
    await queryInterface.addColumn('user_follows', 'new_following_id', { type: Sequelize.UUID }).catch(() => {});

    // Map old user IDs to new UUIDs
    await queryInterface.sequelize.query(`
      UPDATE user_follows SET new_follower_id = u.new_id
      FROM users u WHERE user_follows.follower_id = u.id;
    `);
    await queryInterface.sequelize.query(`
      UPDATE user_follows SET new_following_id = u.new_id
      FROM users u WHERE user_follows.following_id = u.id;
    `);
    
    // Delete orphaned user_follows records
    await queryInterface.sequelize.query(`DELETE FROM user_follows WHERE new_follower_id IS NULL OR new_following_id IS NULL;`);

    // Map posts, comments, likes to new profile_id
    await queryInterface.sequelize.query(`
      UPDATE posts SET new_profile_id = profile.new_user_id
      FROM profile WHERE posts.profile_id = profile.id;
    `);
    await queryInterface.sequelize.query(`
      UPDATE comments SET new_profile_id = profile.new_user_id
      FROM profile WHERE comments.profile_id = profile.id;
    `);
    await queryInterface.sequelize.query(`
      UPDATE likes SET new_profile_id = profile.new_user_id
      FROM profile WHERE likes.profile_id = profile.id;
    `);
    
    // Delete orphaned records from dependent tables
    await queryInterface.sequelize.query(`DELETE FROM likes WHERE new_profile_id IS NULL;`);
    await queryInterface.sequelize.query(`DELETE FROM comments WHERE new_profile_id IS NULL;`);
    await queryInterface.sequelize.query(`DELETE FROM posts WHERE new_profile_id IS NULL;`);

    // Drop old columns
    await queryInterface.removeColumn('user_follows', 'follower_id');
    await queryInterface.removeColumn('user_follows', 'following_id');

    // Rename new columns
    await queryInterface.renameColumn('user_follows', 'new_follower_id', 'follower_id');
    await queryInterface.renameColumn('user_follows', 'new_following_id', 'following_id');
    
    // Update otp_codes and delete orphaned records
    await queryInterface.sequelize.query(`
      UPDATE otp_codes SET new_user_id = users.new_id
      FROM users WHERE otp_codes.user_id = users.id;
    `);
    await queryInterface.sequelize.query(`DELETE FROM otp_codes WHERE new_user_id IS NULL;`);
    
    // Update profile and delete orphaned records
    await queryInterface.sequelize.query(`
      UPDATE profile SET new_user_id = users.new_id
      FROM users WHERE profile.user_id = users.id;
    `);
    await queryInterface.sequelize.query(`DELETE FROM profile WHERE new_user_id IS NULL;`);

    // Drop old columns
    await queryInterface.removeColumn('otp_codes', 'user_id').catch(() => {});
    await queryInterface.removeColumn('profile', 'user_id').catch(() => {});
    await queryInterface.removeColumn('posts', 'profile_id').catch(() => {});
    await queryInterface.removeColumn('comments', 'profile_id').catch(() => {});
    await queryInterface.removeColumn('likes', 'profile_id').catch(() => {});

    // Rename new columns
    await queryInterface.renameColumn('otp_codes', 'new_user_id', 'user_id');
    await queryInterface.renameColumn('profile', 'new_user_id', 'user_id');
    await queryInterface.renameColumn('posts', 'new_profile_id', 'profile_id');
    await queryInterface.renameColumn('comments', 'new_profile_id', 'profile_id');
    await queryInterface.renameColumn('likes', 'new_profile_id', 'profile_id');

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
    await queryInterface.addConstraint('user_follows', {
      fields: ['follower_id'],
      type: 'foreign key',
      name: 'user_follows_follower_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('user_follows', {
      fields: ['following_id'],
      type: 'foreign key',
      name: 'user_follows_following_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('posts', {
      fields: ['profile_id'],
      type: 'foreign key',
      name: 'posts_profile_id_fkey',
      references: { table: 'profile', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('comments', {
      fields: ['profile_id'],
      type: 'foreign key',
      name: 'comments_profile_id_fkey',
      references: { table: 'profile', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('likes', {
      fields: ['profile_id'],
      type: 'foreign key',
      name: 'likes_profile_id_fkey',
      references: { table: 'profile', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // This is a destructive migration, rollback not fully supported
  }
};
