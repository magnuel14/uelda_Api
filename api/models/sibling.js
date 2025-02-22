module.exports = function (sequelize, DataTypes) {
    const User = require('./user')(sequelize, DataTypes);
    const Sibling = sequelize.define('sibling', {
        idSibling: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // ID del usuario que es el hermano
        idUserSibling: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // ID del estudiante al que pertenece este hermano
        idStudent: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

    // Relaciones con el usuario
    Sibling.belongsTo(User, {
        foreignKey: 'idUser',
    });

    return Sibling;
};
