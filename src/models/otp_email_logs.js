module.exports = (sequelize, type) => {
  return sequelize.define('otp_email_logs', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: {
      type: type.STRING,
    },
    receiver: {
      type: type.STRING,
    },
    password: {
      type: type.STRING,
    },
    subject: {
      type: type.STRING,
    },
    body: {
      type: type.TEXT,
    },
    text: {
      type: type.TEXT,
    },
    emailStatus: {
      type: type.STRING,
    },
    cc: {
      type: type.TEXT,
    },
    message: {
      type: type.TEXT,
    },
    type: {
      type: type.STRING,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
};
