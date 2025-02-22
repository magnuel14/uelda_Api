module.exports = function (sequelize, DataTypes) {
    const AcademicYear = require('./academicYear')(sequelize, DataTypes);

    const Course = sequelize.define('course', {
        idCourse: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // initial level, primary, secondary
        academicLevel: {
            type: DataTypes.STRING(50)
        },
        // 1st - 2nd - 3rd etc.
        academicGrade: {
            type: DataTypes.STRING(50)
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
    Course.belongsTo(AcademicYear, {
        foreignKey: 'idAcademicYear'
    });
    Course.associate = function (models) {
        models.course.hasMany(models.paralelo, {
            foreignKey: 'idCourse'
        });
        models.course.hasMany(models.subject, {
            foreignKey: 'idCourse'
        });
    };
    return Course;
};
