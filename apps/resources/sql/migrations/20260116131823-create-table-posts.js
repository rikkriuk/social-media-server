'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        profile_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
              model: 'profile',
              key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        media_ids: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        likes_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        comments_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
    });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('posts');
  },
};
