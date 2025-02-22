module.exports = function (sequelize, DataTypes) {
  const User = require('./user')(sequelize, DataTypes);
  
  const HomeAddress = sequelize.define('homeAddress', {
    idHomeAddress: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idUser',
      },
    },
    //dirección de domicilio
    //parroquia
    parish: {
      type: DataTypes.STRING(50),
    },
    // barrio - ciudadela - sector
    neighborhood: {
      type: DataTypes.STRING(50),
    },
    // referencia de donde esta ubicada la casa
    homeReference: {
      type: DataTypes.STRING(50),
    },
    homeId: {
      type: DataTypes.STRING(50),
    },
    mainStreet: {
      type: DataTypes.STRING(50),
    },
    secondaryStreet: {
      type: DataTypes.STRING(50),
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
  HomeAddress.belongsTo(User, {
    foreignKey: 'idUser'
  });
  return HomeAddress;
};
