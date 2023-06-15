module.exports = function (sequelize, DataTypes) {
    var AnioLectivo = sequelize.define('anioLectivo', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //matutina - vespertina - nocturna
        jornada: {
            type: DataTypes.STRING(50)
        },
        //periodo del año escolar
        periodo: {
            type: DataTypes.STRING(50)
        },
        // fecha de inicio del ciclo escolar 
        // dd-mm-año
        fechaInicio: {
            type: DataTypes.STRING(50)
        },
        // fecha de fin del ciclo escolar 
        // dd-mm-año
        fechaFin: {
            type: DataTypes.STRING(50)
        },
        //presencial - distancia - virtual
        modalidad: {
            type: DataTypes.STRING(50)
        },
         //0: activo , 1: finalizado
         estadoAniolectivo: {
            type: DataTypes.INTEGER
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        // se istancia falso las estampas de tiempo debido a que no
        // es relevante saber fecha de creacion o modificacion la info de esta tabla
        timestamps: false,
        freezeTableName: true
    });

    AnioLectivo.associate = function (models) {
        models.rol.hasMany(models.curso, {
            foreignKey: 'id_anioLectivo'
        });
    };

    return AnioLectivo;
};