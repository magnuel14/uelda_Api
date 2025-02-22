module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    
    const VisibilityList = sequelize.define('visibilityList', {
        idVisibilityList: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // Título del grupo de visibilidad, ejemplo: junta directiva
        groupTitle: {
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

    VisibilityList.belongsTo(User, {
        foreignKey: 'idUser'
    });

    VisibilityList.associate = function (models) {
        models.visibilityList.hasMany(models.visibilityListUser, {
            foreignKey: 'idVisibilityList'
        });
    };
    
    return VisibilityList;
};
