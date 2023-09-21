module.exports = function (sequelize, DataTypes) {
    var AuditUELDA = sequelize.define('uditUELDA', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        error: {
            type: DataTypes.TEXT
        },
        date:{
            type:DataTypes.STRING(50)
        },
        queryStats: {
            type: DataTypes.JSONB, // O el tipo de datos adecuado
            allowNull: true,
        }
    }, {
        //INSERT INTO `audit-uelda`.log SET error=?, date = NOW()", error.stack.replaceAll("'","")
        timestamps: false,
        freezeTableName: true
    });

    return AuditUELDA;
};