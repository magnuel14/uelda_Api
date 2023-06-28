module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
    var PostAcademico = sequelize.define('postAcademico', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        titulo: {
            type: DataTypes.STRING(50)
        },
        //anuncio academicos - formato de calificaciones - horario -carga docente, etc
        tipoArchivo: {
            type: DataTypes.STRING(50)
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        url_archivo: {
            type: DataTypes.TEXT
        },
        //validacion para comporbar quien puede visualizar el post
        //  Todos, solo personal, grupo especifico
        //     0  -     1       -       2
        visibilidad: {
            type: DataTypes.INTEGER,
        },
        //si esta en 0 el contenido estara disponible - si esta en 1 el contenido estaba oculto.
        estado: {
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
    PostAcademico.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    PostAcademico.associate = function (models) {
        models.postAcademico.hasMany(models.postAca_listaVisibilidad, {
            foreignKey: 'id_postAcademico'
        });
    };
    return PostAcademico;
};
