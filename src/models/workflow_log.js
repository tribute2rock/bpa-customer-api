module.exports = (sequelize, type) => {
  return sequelize.define('workflow_log', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requestIsHere: {
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
    groupId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    nextGroupId: {
      type: type.INTEGER,
      references: {
        model: 'groups',
        key: 'id',
      },
      allowNull: true,
    },
    currentUserId: {
      type: type.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    },
    actionId: {
      type: type.INTEGER,
      references: {
        model: 'actions',
        key: 'id',
      },
      allowNull: false,
    },
    comment: {
      type: type.TEXT,
    },
  });
};
