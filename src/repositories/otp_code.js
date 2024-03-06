const { OtpCode } = require('../models');

const store = async ({ value, type, code, customerId }) => {
  try {
    await OtpCode.create({
      value,
      type,
      code,
      customerId,
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
};

module.exports = { store };
