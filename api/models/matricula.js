module.exports = function (sequelize, DataTypes) {
    var Persona = require('../models/persona')(sequelize, DataTypes);
    var Paralelo = require('../models/paralelo')(sequelize, DataTypes);
    var Matricula = sequelize.define('matricula', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //curso al que va matricularse
        cursoMatricula: {
            type: DataTypes.STRING(50)
        },
        //solo para estudiantes nuevos
        //plantel de donde proviene
        plnatelAnterior: {
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
    Matricula.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    Matricula.belongsTo(Paralelo, {
        foreignKey: 'id_paralelo'
    });
    Matricula.associate = function (models) {
        models.matricula.hasMany(models.materia, {
            foreignKey: 'id_matricula'
        });
    };
    return Matricula;
};