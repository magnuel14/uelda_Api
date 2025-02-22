module.exports = (sequelize, DataTypes) => {
    const VisibilityList = require('./visibilityList')(sequelize, DataTypes);
    
    const VisibilityListUser = sequelize.define('visibilityListUser', {
        idVisibilityListUser: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // ID del usuario que puede visualizar el post académico
        externalUserId: {
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
    
    VisibilityListUser.belongsTo(VisibilityList, {
        foreignKey: 'idVisibilityList'
    });
    
    return VisibilityListUser;
};
