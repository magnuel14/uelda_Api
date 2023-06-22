module.exports = function (sequelize, DataTypes) {
    var materia = require('./materia');
    var Materia = new materia(sequelize, DataTypes);
    var matricula = require('./matricula');
    var Matricula = new matricula(sequelize, DataTypes);
    var AsistenciaXMate = sequelize.define('asistenciaXMate', {
        //las asistencias por materia en educacion basica superior y bachillerato
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //el tal de horas x materia se saca directamente de la materia a la que pertenece la asistencia
        //total de numero de horas dictadas por el docente
        horasClase_dictadas: {
            type: DataTypes.STRING(50)
        },
        //total de numero de horas asistidas por el estudiante
        horasClase_asistidas: {
            type: DataTypes.STRING(50)
        },
        /** 
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
        */
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
    AsistenciaXMate.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return AsistenciaXMate;
};