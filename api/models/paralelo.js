module.exports = function (sequelize, DataTypes) {
    var Curso = require('./curso')(sequelize, DataTypes);
    var Paralelo = sequelize.define('paralelo', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        titulo: {
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
    Paralelo.belongsTo(Curso, {
        foreignKey: 'id_curso'
    });
    Paralelo.associate = function (models) {
        models.paralelo.hasMany(models.matricula, {
            foreignKey: 'id_paralelo'
        });
    };
    return Paralelo;
};