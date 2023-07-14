module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
    var ListaVisibilidad = sequelize.define('listaVisibilidad', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //Titulo del grupo de visibilidad ejemplo: junta directiva
        titulo_Grupo: {
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

    ListaVisibilidad.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });

    ListaVisibilidad.associate = function (models) {
        models.listaVisibilidad.hasMany(models.listaVisibilidad_persona, {
            foreignKey: 'id_listaVisibilidad'
        });
    };
    return ListaVisibilidad;
};
