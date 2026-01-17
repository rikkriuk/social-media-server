module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_follows", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      follower_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      following_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint("user_follows", {
      fields: ["follower_id", "following_id"],
      type: "unique",
      name: "unique_follow",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("follows");
  },
};
