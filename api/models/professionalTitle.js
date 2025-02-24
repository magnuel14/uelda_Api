module.exports = (sequelize, DataTypes) => {
    const ProfessionalProfile = require('./professionalProfile')(sequelize, DataTypes);
    
    const ProfessionalTitle = sequelize.define('professionalTitle', {
        idProfessionalTitle: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Nombre del título profesional obtenido
        titleName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        // Tipo de título: Pregrado = 0 , Postgrado = 1, Magíster = 2, Doctorado = 3
        titleType: {
            type: DataTypes.INTEGER
        },
        // Año de obtención del título
        yearOfAchievement: {
            type: DataTypes.INTEGER,
            allowNull: false
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
    
    // Relación con el perfil profesional
    ProfessionalTitle.belongsTo(ProfessionalProfile, {
        foreignKey: 'idProfessionalProfile'
    });
    
    return ProfessionalTitle;
};
