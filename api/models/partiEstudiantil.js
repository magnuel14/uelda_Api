module.exports = function (sequelize, DataTypes) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, DataTypes);
    var PartiEstudiantil = sequelize.define('partiestudiantil', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //1ro 80 horas -2do 120 horas
        numHoras: {
            type: DataTypes.STRING(50)
        },
        //calificacion 
        calificacion: {
            type: DataTypes.STRING(50)
        },
        //aprobado
        aprobado: {
            type: DataTypes.INTEGER
        },
        //observaciones ocasos especiales
        observacion: {
            type: DataTypes.STRING(250)
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
    PartiEstudiantil.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return PartiEstudiantil;
};

/**
 * tabla extra participacion estudiantil
 * numero de horas 
 * calificacion
 * 1ro y 2do
 * 3ro en casos especiales
 * total de horas
 * casos especiales
 * certificado
 */