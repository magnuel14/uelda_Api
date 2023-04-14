module.exports = function (sequelize, DataTypes) {
    var curso = require('./curso');
    var Curso = new curso(sequelize, DataTypes);
    var Materia = sequelize.define('materia', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING(50)
        },
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Materia.belongsTo(Curso, {
        foreignKey: 'id_curso'
    });
    return Materia;
};