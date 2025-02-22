module.exports = (sequelize, DataTypes) => {
    const Course = require('./course')(sequelize, DataTypes);
    
    const Subject = sequelize.define('subject', {
        idSubject: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Área a la que pertenece la asignatura: Matemática, Ciencias Naturales, etc.
        subjectArea: {
            type: DataTypes.STRING(50)
        },
        // Nombre de la asignatura: Matemática, Física, Química, etc.
        subjectName: {
            type: DataTypes.STRING(50)
        },
        // 0 por quimestre - 1 por trimestre
        gradingType: {
            type: DataTypes.INTEGER
        },
        // Total de horas asignadas a la materia por año escolar
        // Número de horas programadas para la materia
        scheduledClassHours: {
            type: DataTypes.STRING(50)
        },
        // 0 activa - 1 inactiva: Caso 3ro Bachillerato hay materias optativas
        status: {
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
    
    Subject.associate = function (models) {
        models.subject.hasMany(models.subjectAttendance, {
            foreignKey: 'idSubject'
        });
        models.subject.hasMany(models.calificacionQuimestre, {
            foreignKey: 'idSubject'
        });
        models.subject.hasMany(models.calificacionTrimestre, {
            foreignKey: 'idSubject'
        });
    };
    
    Subject.belongsTo(Course, {
        foreignKey: 'idCourse'
    });
    
    return Subject;
};
