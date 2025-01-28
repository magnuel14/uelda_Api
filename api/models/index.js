"use strict";
require('dotenv').config();
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV;
var config = require('../../database/database.js')[env];
//var sequelize = new Sequelize(config);
var sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    database: 'ueldaTest',
    username: 'uelda',
    password: '1412'
});
/**
 * # BD dev
DATABASE_HOST = localhost
DATABASE_DIALECT = postgres
DATABASE_PORT = 5432
DATABASE_USER = uelda
DATABASE_PASS = 1412
DATABASE_NAME = ueldaTest
 *   development: {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
  },
 */
var db = {};
fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
module.exports = db;
