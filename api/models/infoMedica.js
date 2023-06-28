module.exports = function (sequelize, DataTypes) {
    var Persona = require('./persona')(sequelize, DataTypes);
    var InfoMedica = sequelize.define('infoMedica', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //Discapacidad 0 = si, 1 = no 
        discapacidad: {
            type: DataTypes.INTEGER
        },
        //Tipo de discapacidad: 
        //discapacidad = 0 se activa esta casilla
        //discapacidad = 1  esta casilla permamece desactivada
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
        //enfermedadCatastrofica 0 = si, 1 = no 
        enfermedadCatastrofica: {
            type: DataTypes.INTEGER
        },
        //Tipo de enfermedad catastrófica:
        //enfermedadCatastrofica = 0 se activa esta casilla
        //enfermedadCatastrofica = 1  esta casilla permamece desactivada
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