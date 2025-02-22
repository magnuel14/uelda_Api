module.exports = (sequelize, DataTypes) => {
    const ProfessionalProfile = require('./professionalProfile')(sequelize, DataTypes);
    const ProfessionalTitle = sequelize.define('professionalTitle', {
        idProfessionalTitle: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        educationLevel: {
            type: DataTypes.STRING(50)
        },
        undergraduateDegree: {
            type: DataTypes.STRING(100)
        },
        undergraduateSpecialty: {
            type: DataTypes.STRING(100)
        },
        postgraduateDegree: {
            type: DataTypes.STRING(100)
        },
        postgraduateSpecialty: {
            type: DataTypes.STRING(100)
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
    
    ProfessionalTitle.belongsTo(ProfessionalProfile, {
        foreignKey: 'idProfessionalProfile'
    });
    
    return ProfessionalTitle;
};
