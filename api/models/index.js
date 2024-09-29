"use strict";
require('dotenv').config();
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV;
var config = require('../../database/database.js')[env];
// Configuración de Sequelize con los datos de conexión
const sequelize = new Sequelize('ueldaTest', 'uelda', '1412', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});
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
db.Sequelize = sequelize;
module.exports = db;
