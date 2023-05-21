module.exports = function (sequelize, DataTypes) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, DataTypes);
    var InfoDocente = sequelize.define('infoDocente', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_Materia_Tutor: {
            type: DataTypes.INTEGER
        },
        //se recibe un arreglo de las materias a su cargo.
        ids_Materia_caraHoraria: {
            type: DataTypes.STRING(50)
        },
        //se recibe un arreglo de los cursos a su cargo
        ids_Cursos: {
            type:  DataTypes.STRING(50)
        },
        //se recibe un arreglo de los paralelos a su cargo
        ids_Paralelos: {
            type:  DataTypes.STRING(50)
        },
        nro_Horas: {
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
    InfoDocente.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    return InfoDocente;
};