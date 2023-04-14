module.exports = function (sequelize, DataTypes) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, DataTypes);
    var Cuenta = sequelize.define('cuenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        correo: {
            type: DataTypes.STRING(50)
        },
        clave: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.TEXT
        },
        estado: {
            type: DataTypes.INTEGER,
        }
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Cuenta.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return Cuenta;
};