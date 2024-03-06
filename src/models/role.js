module.exports = (sequelize, type) => {
  return sequelize.define('role', {
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
      unique: true,
    },
    description: {
      type: type.TEXT,
      allowNull: false,
    },
  });
};
