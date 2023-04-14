module.exports = function (sequelize, DataTypes) {
    var añoLectivo = require('./añoLectivo');
    var AñoLectivo = new añoLectivo(sequelize, DataTypes);
    var Curso = sequelize.define('curso', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nivelAcaemico: {
            type: DataTypes.STRING(50)
        },
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Curso.belongsTo(AñoLectivo, {
        foreignKey: 'id_añoLectivo'
    });
    Curso.associate = function (models) {
        models.curso.hasMany(models.materia, {
            foreignKey: 'id_curso'
        });
        models.curso.hasMany(models.paralelo, {
            foreignKey: 'id_curso'
        });
        models.curso.hasMany(models.asistenciaXDia, {
            foreignKey: 'id_curso'
        });
    };
    return Curso;
};