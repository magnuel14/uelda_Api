module.exports = (sequelize, DataTypes) => {
    const CargaHoraria = require('./cargaHoraria')(sequelize, DataTypes);
    
    const CargaHorariaPorParalelo = sequelize.define('cargaHorariaPorParalelo', {
        idCargaHorariaPorParalelo: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // ID de la materia a cargo del docente
        idSubject: {
            type: DataTypes.INTEGER
        },
        // ID de la carga horaria relacionada con el paralelo
        idCargaParalelo: {
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
    
    CargaHorariaPorParalelo.belongsTo(CargaHoraria, {
        foreignKey: 'idCargaHoraria'
    });
    
    return CargaHorariaPorParalelo;
};

// Carga Horaria por Paralelo
/**
 * Relación entre la carga horaria y el paralelo asignado
 * Relación con la materia asignada al docente
 */
