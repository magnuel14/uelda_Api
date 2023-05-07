module.exports = function (sequelize, DataTypes) {
    var rol = require('../models/rol');
    var Rol = new rol(sequelize, DataTypes);
    var Persona = sequelize.define('persona', {
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
        //ciudad nacimiento
        cuidadNaci: {
            type: DataTypes.STRING(50)
        },
        provincia: {
            type: DataTypes.STRING(50)
        },
        //tipo documento identifcacion
        tipoDocId: {
            type: DataTypes.ENUM({
                values: ['cedula', 'pasaporte']
            })
        },
        //numero de identificacion
        numeroId: {
            type: DataTypes.STRING(10)
        },
        //fecha nacimiento
        fechaNaci: {
            type: DataTypes.STRING(50)
        },
        edad: {
            type: DataTypes.STRING(50)
        },
        correoPersonal: {
            type: DataTypes.STRING(50)
        },
        //correro Institucional
        correroInstitucional: {
            type: DataTypes.STRING(50)
        },
        celular: {
            type: DataTypes.STRING(50)
        },
        telefono: {
            type: DataTypes.STRING(50)
        },
        estadoCivil: {
            type: DataTypes.STRING(50)
        },
        etnia: {
            type: DataTypes.STRING(50)
        },
        //numero de cargas familiares
        nCarFamilia: {
            type: DataTypes.INTEGER
        },
        //numero de cargas educativas
        nCarEdu: {
            type: DataTypes.INTEGER
        },
        //parroqui domicilio
        parroquia: {
            type: DataTypes.STRING(50)
        },
        //barrio - ciudadela - sector
        barrio: {
            type: DataTypes.STRING(50)
        },
        //referencia de donde estaubicada la casa
        refeCasa: {
            type: DataTypes.STRING(50)
        },
        //numero de identifiacion de la casa
        idenCasa: {
            type: DataTypes.STRING(50)
        },
        //calle principal
        callePrin: {
            type: DataTypes.STRING(50)
        },
        //calle secundaria
        calleSecond: {
            type: DataTypes.STRING(50)
        },
        //codigo unico nacional de luz
        codigoUnicLuz: {
            type: DataTypes.STRING(50)
        },
        //viven su 2 padres del estudiante
        estadoPadres: {
            type: DataTypes.STRING(50)
        },
        //con quien vive el estudiante
        listaHogar: {
            type: DataTypes.STRING(50)
        },
        foto: {
            type: DataTypes.TEXT
        },
        //estado del estuidante
        //matriculado ,retirado, graduados
        //     0     -     1   -   2       
        estadoAc: {
            type: DataTypes.INTEGER,
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
    Persona.belongsTo(Rol, {
        foreignKey: 'id_rol'
    });
    Persona.associate = function (models) {
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.representante, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.perfilProfesional, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.paralelo, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.infoMedica, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.hermano, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.partiestudiantil, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.postAcademico, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.asistencia, {
            foreignKey: 'id_persona'
        });
    };
    return Persona;
};

/**
 * cedula digital
 */