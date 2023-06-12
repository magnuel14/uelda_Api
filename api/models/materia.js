module.exports = function (sequelize, DataTypes) {
    var Materia = sequelize.define('materia', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING(50)
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Materia.associate = function (models) {
        models.materia.hasMany(models.matricula, {
            foreignKey: 'id_materia'
        });
    };
    return Materia;
};