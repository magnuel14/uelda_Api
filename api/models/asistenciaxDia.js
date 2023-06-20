module.exports = function (sequelize, DataTypes) {
    var matricula = require('./matricula');
    var Matricula = new matricula(sequelize, DataTypes);
    var AsistenciaXDia = sequelize.define('asistenciaXDia', {
        //las asistencias por dia en educacion basica e inicial, debio a que un solo profesor da 
        //clases duarante todo el dia academico
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // 0 si asiste, 1 si falta
        asistencia: {
            type: DataTypes.INTEGER
        },
        //llenar de forma grupal
        fechaRegistro: {
            type: DataTypes.STRING(50)
        },
        observacion: {
            type: DataTypes.STRING(255)
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
    AsistenciaXDia.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return AsistenciaXDia;
};