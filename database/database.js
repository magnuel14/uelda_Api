const dotenv = require('dotenv');
dotenv.config();

const config = {
  development: {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
  },
  staging: {
    host: process.env.PROD_DATABASE_HOST,
    dialect: process.env.PROD_DATABASE_DIALECT,
    database: process.env.PROD_DATABASE_NAME,
    username: process.env.PROD_DATABASE_USER,
    password: process.env.PROD_DATABASE_PASS
  }
};

module.exports = config;