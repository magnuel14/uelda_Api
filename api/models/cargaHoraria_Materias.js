module.exports = function (sequelize, DataTypes) {
    var CargaHoraria = require('./cargaHoraria')(sequelize, DataTypes);
    var CargaHoraria_Materias = sequelize.define('cargaHoraria_Materias', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //id de la materia a cargo del docente
        id_materia: {
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
    CargaHoraria_Materias.belongsTo(CargaHoraria, {
        foreignKey: 'id_cargaHoraria'
    });
    return CargaHoraria_Materias;
};