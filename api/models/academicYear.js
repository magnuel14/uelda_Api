module.exports = function (sequelize, DataTypes) {
    const AcademicYear = sequelize.define('academicYear', {
        idAcademicYear: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        // morning - afternoon - night
        journey: {
            type: DataTypes.STRING(50)
        },
        // school year period
        period: {
            type: DataTypes.STRING(50)
        },
        // start date of the school cycle
        // dd-mm-year
        startDate: {
            type: DataTypes.STRING(50)
        },
        // end date of the school cycle
        // dd-mm-year
        endDate: {
            type: DataTypes.STRING(50)
        },
        // in-person - distance - virtual
        modality: {
            type: DataTypes.STRING(50)
        },
        // 0 for bimester - 1 for trimester
        gradingType: {
            type: DataTypes.INTEGER
        },
        // 0: active, 1: finished
        academicYearStatus: {
            type: DataTypes.INTEGER
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        // timestamps are set to false as creation or modification dates are not relevant for this table
        timestamps: false,
        freezeTableName: true
    });

    AcademicYear.associate = function (models) {
        models.academicYear.hasMany(models.course, {
            foreignKey: 'idAcademicYear'
        });
    };

    return AcademicYear;
};
