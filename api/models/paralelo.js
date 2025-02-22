module.exports = (sequelize, DataTypes) => {
    const Course = require('./course')(sequelize, DataTypes);
    const Paralelo = sequelize.define('paralelo', {
        idParalelo: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
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
    
    Paralelo.belongsTo(Course, {
        foreignKey: 'idCourse'
    });
    
    Paralelo.associate = function (models) {
        models.paralelo.hasMany(models.matricula, {
            foreignKey: 'idParalelo'
        });
    };
    
    return Paralelo;
};
