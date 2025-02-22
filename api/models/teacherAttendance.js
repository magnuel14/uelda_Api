module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    
    const TeacherAttendance = sequelize.define('teacherAttendance', {
        idTeacherAttendance: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // 0 si asiste, 1 si falta
        attendanceStatus: {
            type: DataTypes.INTEGER
        },
        // Llenar de forma grupal
        registrationDate: {
            type: DataTypes.STRING(50)
        },
        observation: {
            type: DataTypes.TEXT
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
    
    TeacherAttendance.belongsTo(User, {
        foreignKey: 'idUser'
    });
    
    return TeacherAttendance;
};
