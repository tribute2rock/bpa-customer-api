module.exports = (sequelize, type) => {
  return sequelize.define('category', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    iconFile: {
      type: type.STRING,
      allowNull: true,
    },
    otherServices: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    otherServicesUrl: {
      type: type.STRING,
      allowNull: true,
    },
    parentId: {
      type: type.TINYINT,
      allowNull: true,
    },
  });
};
