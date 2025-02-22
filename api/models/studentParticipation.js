module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    const StudentParticipation = sequelize.define('studentParticipation', {
        idStudentParticipation: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //nombre del campo de acción
        actionFieldTitle: {
            type: DataTypes.STRING(50)
        },
        description: {
            type: DataTypes.TEXT
        },
        // 1ro 80 horas - 2do 120 horas
        totalHours: {
            type: DataTypes.STRING(50)
        },
        // Calificación
        grade: {
            type: DataTypes.STRING(50)
        },
        // Observaciones o casos especiales
        observation: {
            type: DataTypes.STRING(250)
        },
        // Aprobado (0 = No, 1 = Sí)
        approved: {
            type: DataTypes.INTEGER
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
    
    StudentParticipation.belongsTo(User, {
        foreignKey: 'idUser'
    });
    
    return StudentParticipation;
};

/**
 * Tabla extra para la participación estudiantil.
 * Número de horas, calificación, aprobación.
 * 1ro: 80 horas - 2do: 120 horas.
 * 3ro en casos especiales.
 * Total de horas y certificados.
 */
