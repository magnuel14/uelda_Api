module.exports = function (sequelize, DataTypes) {
    var Matricula = require('./matricula')(sequelize, DataTypes);
    var AsistenciaXDia = sequelize.define('asistenciaXDia', {
        //las asistencias por dia en educacion basica e inicial, debio a que un solo profesor da 
        //clases duarante todo el dia academico
        //las asistencias por materia en educacion basica superior y bachillerato
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //total de numero de horas programadas en total
        horasClase_programadas: {
            type: DataTypes.STRING(50)
        },
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
    AsistenciaXDia.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return AsistenciaXDia;
};