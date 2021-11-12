// require('dotenv-safe').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dialect: "pgsql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSOWORD,
    database: process.env.DB_DATABASE,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: "pgsql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
