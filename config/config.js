require('dotenv').config()
module.exports = {

  //Configurations of DB
  development: {
    dialect: process.env.DEV_DB_DIALECT ,
    host: process.env.DEV_DB_HOST ,
    port: process.env.DEV_DB_PORT ,
    database: process.env.DEV_DB_NAME ,
    username: process.env.DEV_DB_USERNAME ,
    password: process.env.DEV_DB_PASSWORD
  },

  test: {
    dialect: process.env.TEST_DB_DIALECT,
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWD
  },

  production: {
    dialect:  process.env.PROD_DB_DIALECT,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWD
  },

  //Configurations of Seeds
  seederStorage: "sequelize",
  seederStorageTableName: "seeds",

  // Configurations of Migrations
  migrationStorage: "sequelize",
  migrationStorageTableName: "migrations"

}
