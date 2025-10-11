'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize;

    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    const tables = await sequelize.query(
      `SELECT tc.table_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.columns c ON c.table_name = tc.table_name AND c.column_name = kcu.column_name
       WHERE tc.constraint_type = 'PRIMARY KEY'
         AND kcu.column_name = 'id'
         AND c.data_type IN ('integer','bigint');`,
      { type: sequelize.QueryTypes.SELECT }
    );

    for (const row of tables) {
      const table = row.table_name;
      console.log(`Converting table ${table}`);

      await sequelize.query(`ALTER TABLE "${table}" ADD COLUMN id_new uuid DEFAULT gen_random_uuid();`);

      await sequelize.query(`UPDATE "${table}" SET id_new = gen_random_uuid() WHERE id_new IS NULL;`);

      const fks = await sequelize.query(
        `SELECT tc.table_name AS fk_table, kcu.column_name AS fk_column, tc.constraint_name AS constraint_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
         JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
         WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = '${table}';`,
        { type: sequelize.QueryTypes.SELECT }
      );

      for (const fk of fks) {
        const fkTable = fk.fk_table;
        const fkCol = fk.fk_column;
        const constraintName = fk.constraint_name;
        const fkNewCol = fkCol + '_new_uuid';

        await sequelize.query(`ALTER TABLE "${fkTable}" ADD COLUMN "${fkNewCol}" uuid;`);

        await sequelize.query(
          `UPDATE "${fkTable}" ft
           SET "${fkNewCol}" = pt.id_new
           FROM "${table}" pt
           WHERE ft."${fkCol}" = pt.id;`
        );

        await sequelize.query(`ALTER TABLE "${fkTable}" DROP CONSTRAINT IF EXISTS "${constraintName}";`);

        await sequelize.query(`ALTER TABLE "${fkTable}" RENAME COLUMN "${fkCol}" TO "${fkCol}_old";`);

        await sequelize.query(`ALTER TABLE "${fkTable}" RENAME COLUMN "${fkNewCol}" TO "${fkCol}";`);
      }

      await sequelize.query(`ALTER TABLE "${table}" RENAME COLUMN id TO id_old;`);
      await sequelize.query(`ALTER TABLE "${table}" RENAME COLUMN id_new TO id;`);

      const pk = await sequelize.query(
        `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='${table}' AND constraint_type='PRIMARY KEY';`,
        { type: sequelize.QueryTypes.SELECT }
      );
      if (pk && pk.length > 0) {
        const pkName = pk[0].constraint_name;
        await sequelize.query(`ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${pkName}";`);
      }
      await sequelize.query(`ALTER TABLE "${table}" ADD PRIMARY KEY (id);`);

      for (const fk of fks) {
        const fkTable = fk.fk_table;
        const fkCol = fk.fk_column;
        const constraintName = fk.constraint_name;
        const newConstraint = `${fkTable}_${fkCol}_fkey`;
        await sequelize.query(
          `ALTER TABLE "${fkTable}"
           ADD CONSTRAINT "${newConstraint}" FOREIGN KEY ("${fkCol}") REFERENCES "${table}"(id) ON DELETE CASCADE ON UPDATE CASCADE;`
        );
      }
    }

  },

  down: async (queryInterface, Sequelize) => {
    throw new Error('This migration is not reversible automatically. Manual rollback required.');
  }
};
