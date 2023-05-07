module.exports = function (sequelize, DataTypes) {
    var materia = require('./materia');
    var Materia = new materia(sequelize, DataTypes);
    var AsistenciaXMate = sequelize.define('asistenciaXMate', {
        //las asistencias por materia en educacion basica superior y bachillerato
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //numero de horas 
        //llenar de forma grupal o de forma individual
        horasClase: {
            type: DataTypes.STRING(50)
        },
        // o si asiste, 1 si falta
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
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    AsistenciaXMate.belongsTo(Materia, {
        foreignKey: 'id_materia'
    });
    return AsistenciaXMate;
};