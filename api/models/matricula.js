module.exports = (sequelize, DataTypes) => {
    const Paralelo = require('../models/paralelo')(sequelize, DataTypes);
    const User = require('../models/user')(sequelize, DataTypes);

    const Matricula = sequelize.define('matricula', {
        idMatricula: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Curso al que va a matricularse
        courseEnrollment: {
            type: DataTypes.STRING(50)
        },
        // Solo para estudiantes nuevos
        // Plantel de donde proviene
        previousInstitution: {
            type: DataTypes.STRING(50)
        },
        // ID del año lectivo actual
        currentAcademicYearId: {
            type: DataTypes.INTEGER
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'fechaRegistro',
        updatedAt: 'fechaModificacion'
    });

    Matricula.belongsTo(Paralelo, {
        foreignKey: 'idParalelo'
    });

    Matricula.belongsTo(User, {
        foreignKey: 'idUser'
    });

    Matricula.associate = function (models) {
        models.matricula.hasMany(models.calificacionQuimestre, {
            foreignKey: 'idMatricula'
        });
        models.matricula.hasMany(models.calificacionTrimestre, {
            foreignKey: 'idMatricula'
        });
        models.matricula.hasMany(models.subjectAttendance, {
            foreignKey: 'idMatricula'
        });
        models.matricula.hasMany(models.dailyAttendance, {
            foreignKey: 'idMatricula'
        });
    };

    return Matricula;
};
