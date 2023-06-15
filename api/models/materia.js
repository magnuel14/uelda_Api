module.exports = function (sequelize, DataTypes) {
    var matricula = require('./matricula');
    var Matricula = new matricula(sequelize, DataTypes);
    var Materia = sequelize.define('materia', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
         //área que pertenece a la asignatura: matematica, ciencias naturales, etc
         area: {
            type: DataTypes.STRING(50)
        },
        //nombre de la asignatura: matematica, fisica, quimica, etc
        nombre: {
            type: DataTypes.STRING(50)
        },
        //0 por quimestre - 1 por trimestre
        tipoCalificacion: {
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
    Materia.associate = function (models) {
        models.materia.hasMany(models.asistenciaXMate, {
            foreignKey: 'id_materia'
        });
        models.materia.hasMany(models.calificacionQ, {
            foreignKey: 'id_materia'
        });
        models.materia.hasMany(models.calificacionT, {
            foreignKey: 'id_materia'
        });
    };
    Materia.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return Materia;
};