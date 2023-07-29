module.exports = function (sequelize, DataTypes) {
    var ListaVisibilidad = require('./listaVisibilidad')(sequelize, DataTypes);
    var ListaVisibilidad_persona = sequelize.define('listaVisibilidad_persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // ID de la persona que puede visualizar el post academico
        external_id_persona: {
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
    ListaVisibilidad_persona.belongsTo(ListaVisibilidad, {
        foreignKey: 'id_listaVisibilidad'
    });
    return ListaVisibilidad_persona;
};
