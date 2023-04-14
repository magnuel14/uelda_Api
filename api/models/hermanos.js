module.exports = function (sequelize, DataTypes) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, DataTypes);
    var Hermano = sequelize.define('hermano', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING(50)
        },
        apellido: {
            type: DataTypes.STRING(50)
        },
        tipoDocIdentificacion: {
            type: DataTypes.STRING(50)
        },
        numeroIdentificacion: {
            type: DataTypes.STRING(10)
        }
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Hermano.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return Hermano;
};