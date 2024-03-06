module.exports = (sequelize, type) => {
  return sequelize.define('status', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
  });
};
