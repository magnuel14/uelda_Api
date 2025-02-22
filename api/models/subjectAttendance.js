module.exports = (sequelize, DataTypes) => {
    const Subject = require('./subject')(sequelize, DataTypes);
    const Matricula = require('./matricula')(sequelize, DataTypes);
    
    const SubjectAttendance = sequelize.define('subjectAttendance', {
        idSubjectAttendance: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Las asistencias por materia en educación básica superior y bachillerato
        // El total de horas por materia se obtiene directamente de la materia a la que pertenece la asistencia
        // Total de número de horas dictadas por el docente
        taughtClassHours: {
            type: DataTypes.STRING(50)
        },
        // Total de número de horas asistidas por el estudiante
        attendedClassHours: {
            type: DataTypes.STRING(50)
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'registrationDate',
        updatedAt: 'modificationDate'
    });
    
    SubjectAttendance.belongsTo(Subject, {
        foreignKey: 'idSubject'
    });
    
    SubjectAttendance.belongsTo(Matricula, {
        foreignKey: 'idMatricula'
    });
    
    return SubjectAttendance;
};
