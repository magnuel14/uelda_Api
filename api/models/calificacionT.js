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
        //primer timestre 3 puntos
        //aportes 90%
        aportesPrimerTimestre: {
            type: DataTypes.STRING(50)
        },
        //Evaluación de periodo académico 1er T
        //Proyecto Integrador fase 1 (5%)
        proIntegradorFase_1: {
            type: DataTypes.STRING(50)
        },
        //Mecanismo de evaluación estructurado (5%)
        evaluacion_estructurada_1: {
            type: DataTypes.STRING(50)
        },
        //total primer trimestre equivalencia se suma las 3 secciones: 10 == 3
        totalPT: {
            type: DataTypes.STRING(50)
        },
        //segundo timestre 3 puntos
        //aportes 90%
        aportesSegundoTimestre: {
            type: DataTypes.STRING(50)
        },
        //Evaluación de periodo académico 2do T
        //Proyecto Integrador fase 2 (5%)
        proIntegradorFase_2: {
            type: DataTypes.STRING(50)
        },
        //Mecanismo de evaluación estructurado (5%)
        evaluacion_estructurada_2: {
            type: DataTypes.STRING(50)
        },
        //total segundo trimestre equivalencia se suma las 3 secciones: 10 == 3
        totalST: {
            type: DataTypes.STRING(50)
        },
        //segundo timestre 3 puntos
        //aportes 90%
        aportesTercerTimestre: {
            type: DataTypes.STRING(50)
        },
        //Evaluación de periodo académico 2do T
        //Proyecto Integrador fase 3 (5%)
        proIntegradorFase_3: {
            type: DataTypes.STRING(50)
        },
        //Mecanismo de evaluación estructurado (5%)
        evaluacion_estructurada_3: {
            type: DataTypes.STRING(50)
        },
        //total tercer trimestre equivalencia se suma las 3 secciones: 10 == 3
        totalTT: {
            type: DataTypes.STRING(50)
        },
        // Proyecto Final (10%)
        // 1 punto
        //para septimo - decimo - 3ro bachillerato
        //se agrega Evaluación de nivel/subnivel
        //en este caso proyecto final cambia su valor (5%) 0.5
        proyecto_Final: {
            type: DataTypes.STRING(50)
        },
        //Evaluación de nivel/subnivel(5%) 0.5
        evaluacion_nivel: {
            type: DataTypes.STRING(50)
        },
        //Nota final (100%): suma de los trimestres - el proyecto final y si es el caso Evaluación de nivel
        total_Final: {
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
