module.exports = function (sequelize, DataTypes) {
  const UserRole = require('./userRole')(sequelize, DataTypes);

  const User = sequelize.define('user', {
    idUser: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    //datos personales
    firstNameUser: {
      type: DataTypes.STRING(50),
    },
    lastNameUser: {
      type: DataTypes.STRING(50),
    },
    nationalityUser: {
      type: DataTypes.STRING(50),
    },
    cityResidenceUser: {
      type: DataTypes.STRING(50),
    },
    provinceResidenceUser: {
      type: DataTypes.STRING(50),
    },
    // tipo documento identifcacion
    documentTypeUser: {
      type: DataTypes.ENUM({
        values: ['cedula', 'pasaporte'],
      }),
    },
    // numero de identificacion
    documentDniNumberUser: {
      type: DataTypes.STRING(250),
    },
    birthDateUser: {
      type: DataTypes.STRING(50),
    },
    ageUser: {
      type: DataTypes.STRING(50),
    },
    personalEmailUser: {
      type: DataTypes.STRING(50),
    },
    institutionalEmailUser: {
      type: DataTypes.STRING(50),
    },
    mobileUser: {
      type: DataTypes.STRING(50),
    },
    phoneUser: {
      type: DataTypes.STRING(50),
    },
    /**
     * 'casado'= 0
        'union libre'= 1
        'viudo'= 2
        'divorciado'= 3
        'soltero'= 4
     */
    maritalStatusUser: {
      type: DataTypes.INTEGER,
    },
    ethnicityUser: {
      type: DataTypes.STRING(50),
    },
    genderUser: {
      type: DataTypes.STRING(50),
    },
    //cargas familiares: personal uelda - padres de familia
    familyDependentsUser: {
      type: DataTypes.INTEGER,
    },
    // cargas educativas: personal uelda - padres de familia
    educationalDependentsUser: {
      type: DataTypes.INTEGER,
    },
    // solo estuiantes
    // codigo unico nacional de luz
    nationalElectricCode: {
      type: DataTypes.STRING(50),
    },
    // solo estuiantes
    // viven su 2 padres del estudiante
    parentStatus: {
      type: DataTypes.STRING(50),
    },
    // solo estuiantes
    // con quien vive el estudiante
    householdList: {
      type: DataTypes.STRING(50),
    },
    photo: {
      type: DataTypes.TEXT,
    },
    publicIdPhoto: {
      type: DataTypes.TEXT,
    },
    //solo estudiante
    // estado del estuidante
    // matriculado, promovido, no promovido, retirado, graduados
    //     0     -     1    -       2     -    3    -    4
    academicStatus: {
      type: DataTypes.INTEGER,
    },
    //solo estudiante
    // subnivel asignado
    // inicial - preparatoria(1er año) - elemental(2-4) - media(5-7) - superior(8-10) - bachillerato
    //   0    -          1            -        2       -      3     -       4        -      5
    assignedSublevel: {
      type: DataTypes.INTEGER,
    },
    //personal uelda
    // rol auxilar para personal uelda
    // sin rolauxiliar -   subInspector
    //       0        -        1
    auxiliaryRole: {
      type: DataTypes.INTEGER,
    },
    // copia de los documentos de identificacion.
    identificationDocumentsUrl: {
      type: DataTypes.TEXT,
    },
    // copia de los documentos de identificacion.
    identificationDocumentsPublicId: {
      type: DataTypes.TEXT,
    },
    externalId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    freezeTableName: true,
    createdAt: 'registrationDate',
    updatedAt: 'modificationDate',
  });
  User.belongsTo(UserRole, {
    foreignKey: 'idUserRole',
  });
  User.associate = function (models) {
    models.user.hasOne(models.accountUser, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.studentParent, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.professionalProfile, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.medicalInfo, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.sibling, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.studentParticipation, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.academicPost, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.visibilityList, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.teacherAttendance, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.cargaHoraria, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.matricula, {
      foreignKey: 'idUser',
    });
    models.user.hasMany(models.homeAddress, {
      foreignKey: 'idUser',
    });
  };
  return User;
};
