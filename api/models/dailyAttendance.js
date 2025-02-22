module.exports = (sequelize, DataTypes) => {
    const Matricula = require('./matricula')(sequelize, DataTypes);
    
    const DailyAttendance = sequelize.define('dailyAttendance', {
        idDailyAttendance: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Las asistencias por día en educación básica e inicial, debido a que un solo profesor da 
        // clases durante todo el día académico
        // Las asistencias por materia en educación básica superior y bachillerato
        
        // Total de número de horas programadas en total
        scheduledClassHours: {
            type: DataTypes.STRING(50)
        },
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
    
    DailyAttendance.belongsTo(Matricula, {
        foreignKey: 'idMatricula'
    });
    
    return DailyAttendance;
};
