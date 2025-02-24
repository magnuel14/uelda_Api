module.exports = function (sequelize, DataTypes) {
    const UserRole = sequelize.define('userRole', {
        idUserRole: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            unique: true
        },
        // rector - vice principal - secretary - inspector - teacher - student
        name: {
            type: DataTypes.STRING(200)
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        // 0 = bloqueado, 1 = vigente, 3 = eliminado
        status: {
            type: DataTypes.INTEGER,
        },
        // 0 por defecto indica admin
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // 0 por defecto indica admin
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true,
        freezeTableName: true
    });
    UserRole.associate = function (models) {
        models.userRole.hasMany(models.user, {
            foreignKey: 'idUserRole'
        });
    };
    return UserRole;
};
