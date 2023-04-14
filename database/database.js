const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    'postgres',
    '1412',
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres'
    }
);
exports.module = sequelize;