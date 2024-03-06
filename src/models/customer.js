module.exports = (sequelize, type) => {
  return sequelize.define('customer', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    accountName: {
      type: type.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: type.STRING,
      unique: true,
      allowNull: false,
    },
    mobileNumber: {
      type: type.STRING,
      allowNull: false,
    },
    email: {
      type: type.STRING,
    },
    branchSol: {
      type: type.STRING,
    },
    password: {
      type: type.STRING,
    },
    customerType: {
      type: type.STRING,
    },
    passwordExpire: {
      type: type.BOOLEAN,
    },
  });
};
