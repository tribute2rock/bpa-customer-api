module.exports = (sequelize, type) => {
  return sequelize.define('request_value', {
    id: {
      autoIncrement: true,
      type: type.INTEGER,
      primaryKey: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    requestId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id',
      },
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    value: {
      type: type.TEXT,
    },
    type: {
      type: type.STRING,
      allowNull: false,
    },
    label: {
      type: type.STRING,
      allowNull: false,
    },
  });
};
