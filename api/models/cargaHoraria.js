module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
    var CargaHoraria = sequelize.define('cargaHoraria', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //id del paralelo donde es tutor el docente
        id_paralelo_tutor: {
            type: DataTypes.INTEGER
        },
        //horas carga horaria
        horas_asignadas: {
            type: DataTypes.STRING(50)
        },
        //id del año lectivo actual
        id_anioLectivo_actual: {
            type:DataTypes.INTEGER
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
    CargaHoraria.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    CargaHoraria.associate = function (models) {
        models.cargaHoraria.hasMany(models.cargaHorariaPorParalelo, {
            foreignKey: 'id_cargaHoraria'
        });
    };
    return CargaHoraria;
};