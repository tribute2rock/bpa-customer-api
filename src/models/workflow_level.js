module.exports = (sequelize, type) => {
  return sequelize.define('workflow_level', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workflowId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'workflows',
        key: 'id',
      },
    },
    level: {
      type: type.INTEGER,
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
    subformId: {
      type: type.INTEGER,
      references: {
        model: 'sub_forms',
        key: 'id',
      },
      allowNull: true,
    },
    triggerId: {
      type: type.INTEGER,
      references: {
        model: 'triggers',
        key: 'id',
      },
    },
    isApprover: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
};
