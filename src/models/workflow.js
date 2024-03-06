module.exports = (sequelize, type) => {
  return sequelize.define('workflow', {
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
    description: {
      type: type.TEXT,
      allowNull: false,
    },
    workflowView: {
      type: type.INTEGER,
      references: {
        model: 'workflowsViews',
        key: 'id',
      },
    },
    workflowType: {
      type: type.ENUM({
        values: ['close', 'open'],
      }),
      defaultValue: 'close',
    },
  });
};
