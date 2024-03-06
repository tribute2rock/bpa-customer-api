module.exports = (sequelize, type) => {
  return sequelize.define('otp_code', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: type.STRING,
      allowNull: false,
    },
    verified: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    value: {
      type: type.STRING,
      allowNull: false,
    },
    customerId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    type: {
      type: type.ENUM({
        values: ['PHONE', 'EMAIL'],
      }),
      defaultValue: 'PHONE',
    },
  });
};
