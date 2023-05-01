//Calificación por Trimestre
module.exports = function (sequelize, DataTypes) {
    var materia = require('./materia');
    var Materia = new materia(sequelize, DataTypes);
    var CalificacionT = sequelize.define('calificacionT', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //primer parcial primer quimestre
        primerTrimestre: {
            type: DataTypes.STRING(50)
        },
        segundoTrimestre: {
            type: DataTypes.STRING(50)
        },
       tercerTrimestre: {
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
    CalificacionT.belongsTo(Materia, {
        foreignKey: 'id_materia'
    });
    return CalificacionT;
};
//timestrs
/**
 - esta tabla se va actualizar cuando se presenten
 - los lineamientos sobre la forma de calificacion 
 - de los trimestrs
 * crear una tabla de calificaciones por timestre
 */