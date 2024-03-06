module.exports = (sequelize, type) => {
  return sequelize.define('workflow_file', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    workflowLogId: {
      type: type.INTEGER,
      references: {
        model: 'workflow_logs',
        key: 'id',
      },
      allowNull: false,
    },
    originalName: {
      type: type.TEXT,
      allowNull: false,
    },
    mimeType: {
      type: type.STRING,
      allowNull: false,
    },
    path: {
      type: type.TEXT,
      allowNull: false,
    },
    filename: {
      type: type.TEXT,
      allowNull: false,
    },
    url: {
      type: type.TEXT,
      allowNull: true,
    },
    size: {
      type: type.INTEGER,
      allowNull: false,
    },
  });
};
