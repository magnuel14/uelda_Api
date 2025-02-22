module.exports = (sequelize, DataTypes) => {
    const Subject = require('./subject')(sequelize, DataTypes);
    const Matricula = require('./matricula')(sequelize, DataTypes);
    
    const CalificacionTrimestre = sequelize.define('calificacionTrimestre', {
        idTrimester: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Primer trimestre 3 puntos
        totalFirstTrimesterCuantity: {
            type: DataTypes.STRING(50)
        },
        totalFirstTrimesterQuality: {
            type: DataTypes.STRING(50)
        },
        // Segundo trimestre 3 puntos
        totalSecondTrimesterCuantity: {
            type: DataTypes.STRING(50)
        },
        totalSecondTrimesterQuality: {
            type: DataTypes.STRING(50)
        },
        // Tercer trimestre 3 puntos
        totalThirdTrimesterCuantity: {
            type: DataTypes.STRING(50)
        },
        totalThirdTrimesterQuality: {
            type: DataTypes.STRING(50)
        },
        // Proyecto Final (10%)
        finalProjectQuality: {
            type: DataTypes.STRING(50)
        },
        finalProjectCuantity: {
            type: DataTypes.STRING(50)
        },
        // Evaluación de nivel/subnivel (5%)
        levelEvaluationQuality: {
            type: DataTypes.STRING(50)
        },
        levelEvaluationCuantity: {
            type: DataTypes.STRING(50)
        },
        // Nota final (100%): suma de los trimestres - el proyecto final y si es el caso Evaluación de nivel
        finalGrade: {
            type: DataTypes.STRING(50)
        },
        // Comportamiento
        behavior: {
            type: DataTypes.STRING(50)
        },
        supplementary: {
            type: DataTypes.STRING(50)
        },
        // Si está en 0 el estudiante está aprobado - si está en 1 no ha sido aprobado
        approved: {
            type: DataTypes.INTEGER
        },
        gradingTypeFlag: {
            type: DataTypes.ENUM('cuantitativo', 'cualitativo'),
            allowNull: false
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
    
    CalificacionTrimestre.belongsTo(Subject, {
        foreignKey: 'idSubject'
    });
    
    CalificacionTrimestre.belongsTo(Matricula, {
        foreignKey: 'idMatricula'
    });
    
    return CalificacionTrimestre;
};

// Trimestre
/**
 * 3 trimestres
 * Proyecto final
 * Evaluación de nivel/subnivel
 * Comportamiento
 * Promedio trimestral con evaluación final
 * Dos decimales sin redondear
 * 
 * Agregar un flag para el tipo de calificación: cualitativo o cuantitativo
 */
