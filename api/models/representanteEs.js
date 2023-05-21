
module.exports = function (sequelize, DataTypes) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, DataTypes);
    var Representante = sequelize.define('representante', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nombre: {
            type: DataTypes.STRING(50)
        },
        apellido: {
            type: DataTypes.STRING(50)
        },
        nacionalidad: {
            type: DataTypes.STRING(50)
        },
        //tipó de documento de identificacion
        tipoDocId: {
            type: DataTypes.ENUM({
                values: ['cedula', 'pasaporte']
            })
        },
        //numero de identificacion
        numeroId: {
            type: DataTypes.STRING(10)
        },
        correoPersonal: {
            type: DataTypes.STRING(50)
        },
        celular: {
            type: DataTypes.STRING(50)
        },
        //nivel de educacion
        nivelEdu: {
            type: DataTypes.STRING(50)
        },
        //ocupacion laboral
        ocuLab: {
            type: DataTypes.STRING(50)
        },
        //direccion del trabajo
        direcTrabajo: {
            type: DataTypes.STRING(50)
        },
        //telefono o celuar del trabajo
        teleTrabajo: {
            type: DataTypes.STRING(50)
        },
        //relacion familar con el estuidante
        relacionFamiliar: {
            type: DataTypes.STRING(50)
        },
        //contacto de emergencia
        contactoEmer: {
            type: DataTypes.INTEGER
        },
        //autorizacion de retirar la carpeta del estudiante, solo un repsentante
        //0 autorizado - 1 no autorizado
        autorizacionRetirarDoc: {
            type: DataTypes.INTEGER
        },
        external_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Representante.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return Representante;
};