module.exports = function (sequelize, DataTypes) {
    var PostAcademico = require('./postAcademico')(sequelize, DataTypes);
    var PostAca_listaVisibilidad = sequelize.define('postAca_listaVisibilidad', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //Titulo del grupo de visibilidad ejemplo: junta directiva
        titulo_Grupo: {
            type: DataTypes.STRING(50)
        },
        // ID de la persona que puede visualizar el post academico
        id_persona: {
            type: DataTypes.INTEGER,
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
    PostAca_listaVisibilidad.belongsTo(PostAcademico, {
        foreignKey: 'id_postAcademico'
    });
    return postAca_listaVisibilidad;
};
