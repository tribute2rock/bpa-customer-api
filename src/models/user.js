module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: type.STRING,
      unique: true,
      allowNull: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    solID: {
      type: type.STRING,
      allowNull: true,
    },
  });
};
