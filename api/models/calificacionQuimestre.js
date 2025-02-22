module.exports = (sequelize, DataTypes) => {
    const Subject = require('./subject')(sequelize, DataTypes);
    const Matricula = require('./matricula')(sequelize, DataTypes);
    
    const CalificacionQuimestre = sequelize.define('calificacionQuimestre', {
        idQuimestre: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Primer parcial primer quimestre
        firstPartialQ1: {
            type: DataTypes.STRING(50)
        },
        // Segundo parcial primer quimestre
        secondPartialQ1: {
            type: DataTypes.STRING(50)
        },
        // Promedio de los dos parciales = 80% del quimestre
        subTotalQ1: {
            type: DataTypes.STRING(50)
        },
        // Examen primer quimestre = 20% del quimestre
        examFisrtQuimestre: {
            type: DataTypes.STRING(50)
        },
        // Total primer quimestre = 50% del año lectivo
        totalFisrtQuimestre: {
            type: DataTypes.STRING(50)
        },
        // Primer parcial segundo quimestre
        firstPartialQ2: {
            type: DataTypes.STRING(50)
        },
        // Segundo parcial segundo quimestre
        secondPartialQ2: {
            type: DataTypes.STRING(50)
        },
        // Promedio de los dos parciales = 80% del quimestre
        subTotalQ2: {
            type: DataTypes.STRING(50)
        },
        // Examen segundo quimestre = 20% del quimestre
        examQ2: {
            type: DataTypes.STRING(50)
        },
        // Total segundo quimestre = 50% del año lectivo
        totalSecondQuimestre: {
            type: DataTypes.STRING(50)
        },
        // Total del año lectivo
        finalGrade: {
            type: DataTypes.STRING(50)
        },
        supplementary: {
            type: DataTypes.STRING(50)
        },
        remedial: {
            type: DataTypes.STRING(50)
        },
        graceExam: {
            type: DataTypes.STRING(50)
        },
        // Si está en 0 el estudiante está aprobado - si está en 1 no ha sido aprobado
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
    
    CalificacionQuimestre.belongsTo(Subject, {
        foreignKey: 'idSubject'
    });
    
    CalificacionQuimestre.belongsTo(Matricula, {
        foreignKey: 'idMatricula'
    });
    
    return CalificacionQuimestre;
};

// Quimestre
/**
 * 2 parciales
 * Examen quimestral
 * Promedio quimestre
 * 2 parciales 80%
 * Examen 20%
 * Promedio anual de los dos quimestres
 * Dos decimales sin redondear
 * 
 * Crear una tabla de calificaciones por trimestre
 */
