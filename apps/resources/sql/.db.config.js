// Load dotenv from ENV_PATH if provided (set by run_migration.sh), otherwise default to .env
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = process.env.ENV_PATH || '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // fallback to default .env if specific env file not present
  dotenv.config();
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
