module.exports = (sequelize, type) => {
  return sequelize.define('permission', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    description: {
      type: type.TEXT,
      allowNull: false,
    },
    group: {
      type: type.STRING,
      allowNull: false,
    },
  });
};
