module.exports = (sequelize, type) => {
  return sequelize.define('draft_request_value', {
    id: {
      autoIncrement: true,
      type: type.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    draftRequestId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'draft_requests',
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
