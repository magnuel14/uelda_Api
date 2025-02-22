module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    
    const AccountUser = sequelize.define('accountUser', {
        idAccountUser: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // 0 activada - 1 desactivada
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
    
    AccountUser.belongsTo(User, {
        foreignKey: 'idUser'
    });
    
    return AccountUser;
};

// Modelo de Cuenta
/**
 * Relación entre la cuenta y el usuario
 * Estado de activación de la cuenta
 * Correo único para cada cuenta
 */
