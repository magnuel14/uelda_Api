module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
    var CargaHoraria = sequelize.define('cargaHoraria', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //id del curso
        id_curso: {
            type: DataTypes.INTEGER
        },
        //lista de ids de paralelos
        id_paralelos: {
            type: DataTypes.STRING(50)
        },
        //lista de ids de materias
        id_materia: {
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
    CargaHoraria.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return CargaHoraria;
};