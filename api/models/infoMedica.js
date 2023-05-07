module.exports = function (sequelize, DataTypes) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, DataTypes);
    var InfoMedica = sequelize.define('infoMedica', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //Tipo de discapacidad 
        tipoDiscapacidad: {
            type: DataTypes.STRING(50)
        },
        //Porcentaje de discapacidad
        porcentajeDiscapacidad: {
            type: DataTypes.STRING(50)
        },
        //Nro de carnet de discapacidad
        nCarnetDiscapacidad: {
            type: DataTypes.STRING(50)
        },
        //Tipo de enfermedad catastrófica
        tipoEnfermedadCatastrofica: {
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
    InfoMedica.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return InfoMedica;
};