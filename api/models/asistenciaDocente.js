module.exports = function (sequelize, DataTypes) {
    var perosna = require('./persona');
    var Persona = new perosna(sequelize, DataTypes);
    var AsistenciaDocente = sequelize.define('asistenciaDocente', {
        //AsistenciaDocente para la planta docente y admistrativos del plantel
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // 0 si asiste, 1 si falta
        asistencia: {
            type: DataTypes.INTEGER
        },
        //llenar de forma grupal
        fechaRegistro: {
            type: DataTypes.STRING(50)
        },
        observacion: {
            type: DataTypes.TEXT
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
    AsistenciaDocente.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return AsistenciaDocente;
};