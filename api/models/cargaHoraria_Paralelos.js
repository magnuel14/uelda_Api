module.exports = function (sequelize, DataTypes) {
    var CargaHoraria = require('./cargaHoraria')(sequelize, DataTypes);
    var CargaHoraria_Paralelos = sequelize.define('cargaHoraria_Paralelos', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //id del paralelo en el cual da clases el docente
        id_paralelo: {
            type: DataTypes.INTEGER
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
    CargaHoraria_Paralelos.belongsTo(CargaHoraria, {
        foreignKey: 'id_cargaHoraria'
    });
    return CargaHoraria_Paralelos;
};