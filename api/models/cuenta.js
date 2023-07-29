module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
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
        //0 activada - 1 desactivada
        estado: {
            type: DataTypes.INTEGER,
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
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