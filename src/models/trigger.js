module.exports = (sequelize, type) => {
  return sequelize.define('trigger', {
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
    action: {
      type: type.TEXT,
      allowNull: false,
    },
  });
};
