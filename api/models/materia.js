module.exports = function (sequelize, DataTypes) {
    var paralelo = require('./paralelo');
    var Paralelo = new paralelo(sequelize, DataTypes);
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
    Materia.belongsTo(Paralelo, {
        foreignKey: 'id_paralelo'
    });
    return Materia;
};