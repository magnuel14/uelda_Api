
module.exports = function (sequelize, DataTypes) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, DataTypes);
    var PerfilProfesional = sequelize.define('perfilProfesional', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //Razón de llegar a la unidad
        razonUELDA: {
            type: DataTypes.ENUM({
                values: [
                    'Sectorización',
                    'Bienestar Social',
                    'Concurso'
                ]
            })
        },
        //Fecha de ingreso al magisterio
        fechaInMag: {
            type: DataTypes.STRING(50)
        },
        //Años en el magisterio
        tiempoMagisterio: {
            type: DataTypes.STRING(50)
        },
        //Fecha ingreso UELDA
        fechaInULEDA: {
            type: DataTypes.STRING(50)
        },
        //Años en la UELDA
        tiempoUelda: {
            type: DataTypes.STRING(50)
        },
        //Categoría
        categoria: {
            type: DataTypes.STRING(50)
        },
        //Años en esta categoría
        aniosCategoria: {
            type: DataTypes.STRING(50)
        },
        //Relación laboral
        relacionLaboral: {
            type: DataTypes.ENUM({
                values: [
                    'Nombramiento Permanente',
                    'Nombramiento Provisional',
                    'Contrato'
                ]
            })
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
    PerfilProfesional.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    PerfilProfesional.associate = function (models) {
        models.perfilProfesional.hasMany(models.tituloProfesional, {
            foreignKey: 'id_perfilProfesional'
        });
    };
    return PerfilProfesional;
};