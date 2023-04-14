module.exports = function (sequelize, DataTypes) {
    var AñoLectivo = sequelize.define('añoLectivo', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //matutina - vespertina - noturna
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
        fechaFin: {
            type: DataTypes.STRING(50)
        },
        //presencial - distancia - virtual
        modalidad: {
            type: DataTypes.STRING(50)
        }
    }, {
        // se istancia falso las estampas de tiempo debido a que no
        // es relevante saber fecha de creacion o modificacion la info de esta tabla
        timestamps: false,
        freezeTableName: true
    });

    AñoLectivo.associate = function (models) {
        models.rol.hasMany(models.curso, {
            foreignKey: 'id_añoLectivo'
        });
    };

    return AñoLectivo;
};