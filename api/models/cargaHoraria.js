module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    
    const CargaHoraria = sequelize.define('cargaHoraria', {
        idCargaHoraria: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // ID del paralelo donde es tutor el docente
        idParaleloTutor: {
            type: DataTypes.INTEGER
        },
        // Horas asignadas en la carga horaria
        horasAsignadas: {
            type: DataTypes.STRING(50)
        },
        // ID del año lectivo actual
        idAnioLectivoActual: {
            type: DataTypes.INTEGER
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'registrationDate',
        updatedAt: 'modificationDate'
    });
    
    CargaHoraria.belongsTo(User, {
        foreignKey: 'idUsuario'
    });
    
    CargaHoraria.associate = function (models) {
        models.cargaHoraria.hasMany(models.cargaHorariaPorParalelo, {
            foreignKey: 'idCargaHoraria'
        });
    };
    
    return CargaHoraria;
};

// Carga Horaria
/**
 * Relación entre la carga horaria y el usuario (docente o administrativo)
 * Horas asignadas a un paralelo específico
 * Relación con el año lectivo actual
 */
