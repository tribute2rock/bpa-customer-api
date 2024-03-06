module.exports = (sequelize, type) => {
  return sequelize.define('dynamicModel', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    dataType: {
      type: type.TEXT,
      allowNull: false,
    },
    model: {
      type: type.TEXT,
      allowNull: true,
    },
  });
};
