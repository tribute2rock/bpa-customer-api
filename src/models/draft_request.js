module.exports = (sequelize, type) => {
  return sequelize.define('draft_request', {
    id: {
      autoIncrement: true,
      type: type.INTEGER,
      primaryKey: true,
    },
    requestKey: {
      type: type.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    authCode: {
      type: type.STRING,
      allowNull: false,
    },
    requestRepeat: {
      type: type.INTEGER,
      allowNull: true,
    },
    statusId: {
      type: type.INTEGER,
      defaultValue: 5,
      references: {
        model: 'statuses',
        key: 'id',
      },
    },
    formId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'forms',
        key: 'id',
      },
    },
    requestSenderId: {
      type: type.INTEGER,
      allowNull: false,
    },
    requestSenderType: {
      type: type.STRING,
    },
    isDraft: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    requestedBranch: {
      type: type.STRING,
    },
  });
};
