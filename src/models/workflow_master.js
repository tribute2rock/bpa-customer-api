module.exports = (sequelize, type) => {
  return sequelize.define('workflow_master', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    isCompleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    requestId: {
      type: type.INTEGER,
      references: {
        model: 'requests',
        key: 'id',
      },
      allowNull: false,
    },
    workflowId: {
      type: type.INTEGER,
      references: {
        model: 'workflows',
        key: 'id',
      },
      allowNull: false,
    },
    workflowLevelId: {
      type: type.INTEGER,
      references: {
        model: 'workflow_levels',
        key: 'id',
      },
      allowNull: false,
    },
    groupId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    triggerId: {
      type: type.INTEGER,
      references: {
        model: 'triggers',
        key: 'id',
      },
    },
    currentGroupId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    startedOn: {
      type: type.DATE,
    },
    completedOn: {
      type: type.DATE,
    },
  });
};
