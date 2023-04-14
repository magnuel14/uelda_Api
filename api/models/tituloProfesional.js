
module.exports = function (sequelize, DataTypes) {
    var perfilProfesional = require('./perfilProfesional');
    var PerfilProfesional = new perfilProfesional(sequelize, DataTypes);
    var TituloProfesional = sequelize.define('tituloProfesional', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //escriba en numero el nivel de su titulo
        nivelTitulo: {
            type: DataTypes.STRING(50)
        },
        especialidad: {
            type: DataTypes.STRING(50)
        },
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    TituloProfesional.belongsTo(PerfilProfesional, {
        foreignKey: 'id_perfilProfesional'
    });
    return TituloProfesional;
};