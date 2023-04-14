module.exports = function (sequelize, DataTypes) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, DataTypes);
    var curso = require('./curso');
    var Curso = new curso(sequelize, DataTypes);
    var Paralelo = sequelize.define('paralelo', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        titulo: {
            type: DataTypes.STRING(50)
        },
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Paralelo.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    Paralelo.belongsTo(Curso, {
        foreignKey: 'id_curso'
    });
    return Paralelo;
};