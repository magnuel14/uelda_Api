
module.exports = function (sequelize, DataTypes) {
    var PerfilProfesional = require('./perfilProfesional')(sequelize, DataTypes);
    var TituloProfesional = sequelize.define('tituloProfesional', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nivelEducacion: {
            type: DataTypes.STRING(50)
        },
        tercerNivel: {
            type: DataTypes.STRING(100)
        },
        tercerEspecialidad: {
            type: DataTypes.STRING(100)
        },
        cuartoNivel: {
            type: DataTypes.STRING(100)
        },
        cuartoEspecialidad: {
            type: DataTypes.STRING(100)
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
    TituloProfesional.belongsTo(PerfilProfesional, {
        foreignKey: 'id_perfilProfesional'
    });
    return TituloProfesional;
};