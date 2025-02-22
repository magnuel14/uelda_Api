module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    
    const MedicalInfo = sequelize.define('medicalInfo', {
        idMedicalInfo: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Discapacidad 0 = sí, 1 = no
        disability: {
            type: DataTypes.INTEGER
        },
        // Tipo de discapacidad (se activa si disability = 0)
        disabilityType: {
            type: DataTypes.STRING(50)
        },
        // Porcentaje de discapacidad
        disabilityPercentage: {
            type: DataTypes.STRING(50)
        },
        // Número de carnet de discapacidad
        disabilityCardNumber: {
            type: DataTypes.STRING(50)
        },
        // Enfermedad catastrófica 0 = sí, 1 = no
        catastrophicIllness: {
            type: DataTypes.INTEGER
        },
        // Tipo de enfermedad catastrófica (se activa si catastrophicIllness = 0)
        catastrophicIllnessType: {
            type: DataTypes.STRING(50)
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
    
    MedicalInfo.belongsTo(User, {
        foreignKey: 'idUser'
    });
    
    return MedicalInfo;
};

// Información Médica
/**
 * Relación entre la información médica y el usuario
 * Registro de discapacidad y enfermedades catastróficas
 * Incluye el porcentaje y tipo de discapacidad si aplica
 * Guarda el número de carnet de discapacidad
 */
