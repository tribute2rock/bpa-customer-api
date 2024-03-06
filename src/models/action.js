module.exports = (sequelize, type) => {
  return sequelize.define('action', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    displayable: {
      type: type.BOOLEAN,
      default: true,
    },
  });
};
