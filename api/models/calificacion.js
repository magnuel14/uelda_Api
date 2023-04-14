module.exports = function (sequelize, DataTypes) {
    var materia = require('./materia');
    var Materia = new materia(sequelize, DataTypes);
    var Calificacion = sequelize.define('calificacion', {
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
        testPQ:{
            type: DataTypes.STRING(50)
        },
        //total primer quimestre = 50% del año lectivo
        totalPQ:{
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
         subTotalPQ: {
            type: DataTypes.STRING(50)
        },
        //examen primer quimestre = 20% del quimestre
        testPQ:{
            type: DataTypes.STRING(50)
        },
        //total primer quimestre = 50% del año lectivo
        totalPQ:{
            type: DataTypes.STRING(50)
        },
        supletorio: {
            type: DataTypes.STRING(50)
        },
        supletoriodos: {
            type: DataTypes.STRING(50)
        },
        gracia: {
            type: DataTypes.STRING(50)
        },
        //si esta en 0 el estudiante esta aprobado - si esta en 1 no ha sido aprobado
        aprobado:{
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Calificacion.belongsTo(Materia, {
        foreignKey: 'id_materia'
    });
    return Calificacion;
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