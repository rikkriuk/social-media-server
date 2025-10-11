'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const cols = ['username', 'email', 'phone_number'];
    for (const col of cols) {
      const duplicates = await queryInterface.sequelize.query(
        `SELECT ${col}, json_agg(json_build_object('id', id, 'uuid', uuid, 'created_at', created_at)) AS rows
         FROM users
         WHERE ${col} IS NOT NULL AND ${col} <> ''
         GROUP BY ${col}
         HAVING count(*) > 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (duplicates && duplicates.length > 0) {
        const list = duplicates.map(d => `${col}='${d[col]}' -> ${JSON.stringify(d.rows)}`).join('\n');
        throw new Error(`Cannot add unique constraint on '${col}' because duplicates exist:\n${list}`);
      }
    }

    await queryInterface.sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username) WHERE username IS NOT NULL AND username <> '';`
    );
    await queryInterface.sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email) WHERE email IS NOT NULL AND email <> '';`
    );
    await queryInterface.sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS users_phone_number_unique ON users (phone_number) WHERE phone_number IS NOT NULL AND phone_number <> '';`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS users_username_unique;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS users_email_unique;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS users_phone_number_unique;`);
  },
};
