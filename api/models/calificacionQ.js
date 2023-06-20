//Calificación por Quimestre
module.exports = function (sequelize, DataTypes) {
    var materia = require('./materia');
    var Materia = new materia(sequelize, DataTypes);
    var matricula = require('./matricula');
    var Matricula = new matricula(sequelize, DataTypes);
    var CalificacionQ = sequelize.define('calificacionQ', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //primer parcial primer quimestre
        firstParcialPQ: {
            type: DataTypes.STRING(50)
        },
        //segundo parcial primer quimestre
        secondParcialPQ: {
            type: DataTypes.STRING(50)
        },
        //promedio de los dos parciales = 80% del quimestre
        subTotalPQ: {
            type: DataTypes.STRING(50)
        },
        //examen primer quimestre = 20% del quimestre
        testPQ: {
            type: DataTypes.STRING(50)
        },
        //total primer quimestre = 50% del año lectivo
        totalPQ: {
            type: DataTypes.STRING(50)
        },
        //primer parcial segundo quimestre
        firstParcialSQ: {
            type: DataTypes.STRING(50)
        },
        //segundo parcial segundo quimestre
        secondParcialSQ: {
            type: DataTypes.STRING(50)
        },
        //promedio de los dos parciales = 80% del quimestre
        subTota2PQ: {
            type: DataTypes.STRING(50)
        },
        //examen primer quimestre = 20% del quimestre
        testSQ: {
            type: DataTypes.STRING(50)
        },
        //total primer quimestre = 50% del año lectivo
        totalSQ: {
            type: DataTypes.STRING(50)
        },
        //total del año lectivo
        notaFinal: {
            type: DataTypes.STRING(50)
        },
        supletorio: {
            type: DataTypes.STRING(50)
        },
        remedial: {
            type: DataTypes.STRING(50)
        },
        gracia: {
            type: DataTypes.STRING(50)
        },
        //si esta en 0 el estudiante esta aprobado - si esta en 1 no ha sido aprobado
        aprobado: {
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
    CalificacionQ.belongsTo(Materia, {
        foreignKey: 'id_materia'
    });
    CalificacionQ.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return CalificacionQ;
};
//quimestre
/**
 * 2 parciales
 * examen quimestral
 * promedio quimestre
 * 2 paraciles 80%
 * examen 20%
 * promedio anual de los dos quimestres
 * dos deciamles sin redondear
 
 * crear una tabla de calificaciones por timestre
 */