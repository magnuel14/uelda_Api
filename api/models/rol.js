module.exports = function (sequelize, DataTypes) {
    var Rol = sequelize.define('rol', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // rector - vicerrectora - secretaria - inspector - docente - estudiante
        nombre: {
            type: DataTypes.STRING(200)
        },
        /**
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
         */
    }, {
        timestamps: false,
        freezeTableName: true
    });
    Rol.associate = function (models) {
        models.rol.hasMany(models.persona, {
            foreignKey: 'id_rol'
        });
    };
    return Rol;
};