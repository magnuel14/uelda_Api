module.exports = (sequelize, DataTypes) => {
    const User = require('./user')(sequelize, DataTypes);
    const AcademicPost = sequelize.define('academicPost', {
        idAcademicPost: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING(50)
        },
        // Anuncio académicos - formato de calificaciones - horario - carga docente, etc.
        fileType: {
            type: DataTypes.STRING(50)
        },
        description: {
            type: DataTypes.TEXT
        },
        imageUrl: {
            type: DataTypes.TEXT
        },
        imagePublicId: {
            type: DataTypes.TEXT
        },
        fileUrl: {
            type: DataTypes.TEXT
        },
        filePublicId: {
            type: DataTypes.TEXT
        },
        // Validación para comprobar quién puede visualizar el post
        //  Todos, solo personal, grupo específico
        //     0  -     1       -       2
        visibility: {
            type: DataTypes.INTEGER,
        },
        // Si está en 0 el contenido estará disponible - si está en 1 el contenido estará oculto.
        status: {
            type: DataTypes.INTEGER,
        },
        // ID del año lectivo actual
        currentAcademicYearId: {
            type: DataTypes.INTEGER
        },
        // ID de la lista visibilidad para comprobar la lista de personas que pueden visualizar el post académico
        visibilityListId: {
            type: DataTypes.INTEGER,
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        freezeTableName: true,
        createdAt: 'registrationDate',
        updatedAt: 'modificationDate'
    });
    
    AcademicPost.belongsTo(User, {
        foreignKey: 'idUser'
    });
    
    return AcademicPost;
};
