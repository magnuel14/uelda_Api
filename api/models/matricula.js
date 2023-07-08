module.exports = function (sequelize, DataTypes) {
    var Paralelo = require('../models/paralelo')(sequelize, DataTypes);
    var Persona = require('../models/persona')(sequelize, DataTypes);
    var Matricula = sequelize.define('matricula', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //curso al que va matricularse
        cursoMatricula: {
            type: DataTypes.STRING(50)
        },
        //solo para estudiantes nuevos
        //plantel de donde proviene
        plantelAnterior: {
            type: DataTypes.STRING(50)
        },
        //id del año lectivo actual
        id_anioLectivo_actual: {
            type: DataTypes.INTEGER
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
    Matricula.belongsTo(Paralelo, {
        foreignKey: 'id_paralelo'
    });
    Matricula.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    Matricula.associate = function (models) {
        models.matricula.hasMany(models.calificacionT, {
            foreignKey: 'id_matricula'
        });
        models.matricula.hasMany(models.calificacionQ, {
            foreignKey: 'id_matricula'
        });
        models.matricula.hasMany(models.asistenciaXMate, {
            foreignKey: 'id_matricula'
        });
        models.matricula.hasMany(models.asistenciaXDia, {
            foreignKey: 'id_matricula'
        });
    };
    return Matricula;
};