module.exports = function (sequelize, DataTypes) {
    const User = require('./user')(sequelize, DataTypes);
    const StudentParent = sequelize.define('studentParent', {
        idStudentParent: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        firstName: {
            type: DataTypes.STRING(50)
        },
        lastName: {
            type: DataTypes.STRING(50)
        },
        nationality: {
            type: DataTypes.STRING(50)
        },
        // Tipo de documento de identificación
        documentType: {
            type: DataTypes.ENUM({
                values: ['cedula', 'pasaporte']
            })
        },
        // Número de identificación
        documentNumber: {
            type: DataTypes.STRING(10)
        },
        personalEmail: {
            type: DataTypes.STRING(50)
        },
        mobile: {
            type: DataTypes.STRING(50)
        },
        // Nivel de educación
        educationLevel: {
            type: DataTypes.STRING(50)
        },
        // Ocupación laboral
        jobOccupation: {
            type: DataTypes.STRING(50)
        },
        // Dirección del trabajo
        workAddress: {
            type: DataTypes.STRING(50)
        },
        // Teléfono o celular del trabajo
        workPhone: {
            type: DataTypes.STRING(50)
        },
        // Relación familiar con el estudiante
        familyRelationship: {
            type: DataTypes.STRING(50)
        },
        // Contacto de emergencia
        emergencyContact: {
            type: DataTypes.STRING(50)
        },
        // Autorización de retirar documentos del estudiante (0: autorizado, 1: no autorizado)
        authorizationToWithdrawDocs: {
            type: DataTypes.INTEGER
        },
        // Copia de los documentos de identificación
        identificationDocumentsUrl: {
            type: DataTypes.TEXT
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

    // Relación con el usuario (Estudiante)
    StudentParent.belongsTo(User, {
        foreignKey: 'idUser'
    });

    return StudentParent;
};
