//Calificación por Trimestre
module.exports = function (sequelize, DataTypes) {
    var Materia = require('./materia')(sequelize, DataTypes);
    var Matricula = require('./matricula')(sequelize, DataTypes);
    var CalificacionT = sequelize.define('calificacionT', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        //primer trimestre 3 puntos
        //total primer trimestre cuantitativo
        totalPrimerTriCuantity: {
            type: DataTypes.STRING(50)
        },
        //total primer trimestre cualitativo
        totalPrimerTriQuality: {
            type: DataTypes.STRING(50)
        },
        //segundo timestre 3 puntos
        //total segundo trimestre cuantitativo
        totalSegundoTriCuantity: {
            type: DataTypes.STRING(50)
        },
        //total segundo trimestre cualitativo
        totalSegundoTriQuality: {
            type: DataTypes.STRING(50)
        },
        //tercer trimestre 3 puntos
        //total tercer trimestre cuantitativo
        totalTercerTriCuantity: {
            type: DataTypes.STRING(50)
        },
        //total tercer trimestre cualitativo
        totalTercerTriQuality: {
            type: DataTypes.STRING(50)
        },
        // Proyecto Final (10%)
        // 1 punto
        //para septimo - decimo - 3ro bachillerato
        //se agrega Evaluación de nivel/subnivel
        //en este caso proyecto final cambia su valor (5%) 0.5
        proyectoFinalQuality: {
            type: DataTypes.STRING(50)
        },
        proyectoFinalCuantity: {
            type: DataTypes.STRING(50)
        },
        //Evaluación de nivel/subnivel(5%) 0.5
        evaluacionNivelQuality: {
            type: DataTypes.STRING(50)
        },
        evaluacionNivelCuantity: {
            type: DataTypes.STRING(50)
        },
        //Nota final (100%): suma de los trimestres - el proyecto final y si es el caso Evaluación de nivel
        total_Final: {
            type: DataTypes.STRING(50)
        },
        //comportamiento
        comportamiento: {
            type: DataTypes.STRING(50)
        },
        supletorio: {
            type: DataTypes.STRING(50)
        },
        //si esta en 0 el estudiante esta aprobado - si esta en 1 no ha sido aprobado
        aprobado: {
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
    CalificacionT.belongsTo(Materia, {
        foreignKey: 'id_materia'
    });
    CalificacionT.belongsTo(Matricula, {
        foreignKey: 'id_matricula'
    });
    return CalificacionT;
};
//poner flag de tipo de califacion: o cualitativo - cuantitativo