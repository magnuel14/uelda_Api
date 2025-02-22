module.exports = function (sequelize, DataTypes) {
    const User = require('./user')(sequelize, DataTypes);
    const ProfessionalProfile = sequelize.define('professionalProfile', {
        idProfessionalProfile: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Razón de llegar a la unidad
        /**
        'Sectorización' = SECTOR
        'Bienestar Social' = SOCIAL_WELFARE
        'Concurso' = CONTEST
         */
        reasonForUelda: {
            type: DataTypes.ENUM({
                values: ['SECTOR', 'SOCIAL_WELFARE', 'CONTEST']
            })
        },
        // Fecha de ingreso al magisterio
        entryDateTeaching: {
            type: DataTypes.STRING(50)
        },
        // Años en el magisterio
        yearsInTeaching: {
            type: DataTypes.STRING(50)
        },
        // Fecha ingreso UELDA
        entryDateUelda: {
            type: DataTypes.STRING(50)
        },
        // Años en la UELDA
        yearsAtUelda: {
            type: DataTypes.STRING(50)
        },
        // Categoría
        category: {
            type: DataTypes.STRING(50)
        },
        // Años en esta categoría
        yearsInCategory: {
            type: DataTypes.STRING(50)
        },
        // Relación laboral
        /**
         'Nombramiento Permanente'= PERMANENT
         'Nombramiento Provisional' = PROVISIONAL
         'Contrato' = CONTRACT
         */
        employmentRelationship: {
            type: DataTypes.ENUM({
                values: ['PERMANENT', 'PROVISIONAL', 'CONTRACT']
            })
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
    ProfessionalProfile.belongsTo(User, {
        foreignKey: 'idUser'
    });
    ProfessionalProfile.associate = function (models) {
        models.professionalProfile.hasMany(models.professionalTitle, {
            foreignKey: 'idProfessionalProfile'
        });
    };
    return ProfessionalProfile;
};
