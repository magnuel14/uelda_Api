module.exports = function (sequelize, DataTypes) {
    var anioLectivo = require('./anioLectivo');
    var AnioLectivo = new anioLectivo(sequelize, DataTypes);
    var Curso = sequelize.define('curso', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nivelAcaemico: {
            type: DataTypes.STRING(50)
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
    Curso.belongsTo(AnioLectivo, {
        foreignKey: 'id_anioLectivo'
    });
    Curso.associate = function (models) {
        models.curso.hasMany(models.matricula, {
            foreignKey: 'id_curso'
        });
    };
    return Curso;
};