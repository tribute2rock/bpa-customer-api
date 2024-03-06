module.exports = (sequelize, type) => {
  return sequelize.define(
    'request',
    {
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
      },
      requestRepeat: {
        type: type.INTEGER,
        allowNull: true,
      },
      statusId: {
        type: type.INTEGER,
        allowNull: false,
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
        defaultValue: false,
      },
      requestedBranch: {
        type: type.STRING,
      },
      customerAccount: {
        type: type.STRING,
      },
      swiftUpload: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
      signatureVerified: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hasTrigger: true,
    }
  );
};
