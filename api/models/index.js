"use strict";
require('dotenv').config();

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

// Cargar la configuración correcta desde el archivo de configuración
const env = process.env.NODE_ENV || 'development';
const config = require('../../database/database.js')[env];

// Crear la instancia de Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Objeto para almacenar los modelos
const db = {};

// Leer todos los archivos de modelos dentro del directorio actual
fs.readdirSync(__dirname)
    .filter(file => (file.indexOf(".") !== 0) && (file !== "index.js"))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Asociar modelos después de que todos han sido cargados
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Asignar la instancia de Sequelize al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
