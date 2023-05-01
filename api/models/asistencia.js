module.exports = function (sequelize, DataTypes) {
    var perosna = require('./persona');
    var Persona = new perosna(sequelize, DataTypes);
    var Asistencia = sequelize.define('asistencia', {
        //Asistencia para la planta docente y admistrativa del plantel
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
            type: DataTypes.STRING(255)
        },
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Asistencia.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return Asistencia;
};