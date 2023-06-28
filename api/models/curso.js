module.exports = function (sequelize, DataTypes) {
    var AnioLectivo = require('./anioLectivo')(sequelize, DataTypes);
    var Curso = sequelize.define('curso', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // nivel inicial, primaria, secundaria
        nivelAcademico: {
            type: DataTypes.STRING(50)
        },
        // 1ro - 2do - 3ro etc
        gradoAcademico: {
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
        models.curso.hasMany(models.paralelo, {
            foreignKey: 'id_curso'
        });
        models.curso.hasMany(models.materia, {
            foreignKey: 'id_curso'
        });
    };
    return Curso;
};