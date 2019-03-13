const Sequelize = require("sequelize");
require('dotenv').config();
const ENV = process.env;

const sequelize = new Sequelize(
  ENV.DB_NAME,
  ENV.DB_USERNAME,
  ENV.DB_PASSWORD,
  {
    host: ENV.DB_HOST,
    dialect: "postgres",
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database via Sequelize");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = sequelize;
