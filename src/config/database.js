const Sequelize = require('sequelize');
const { DB } = require('./index');

/**
 * Create a sequelize database Instance
 */
const connection = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: DB.DIALECT,
  logging: false,
});

connection.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log(`Database and tables created.`);
});

module.exports = connection;
